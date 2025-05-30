import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from "@mui/material";
import { api } from "../../../service/api";

const initialForm = {
  codigo: "",
  cnpj: "",
  ddd: "",
  nomeComprador: "",
  emailComprador: "",
  telCelular: "",
  status: "EM_ANALISE",
  valor: ""
};

const statusOptions = [
  { value: "CONCLUIDO", label: "CONCLUÍDO" },
  { value: "EM_ANALISE", label: "EM ANÁLISE" },
  { value: "EM_ANDAMENTO", label: "EM ANDAMENTO" }
];

const OrderFormModal = ({ open, onClose, onSuccess, pedido }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("empresa"); // empresa = CNPJ, pf = CPF
  const [componentes, setComponentes] = useState([]);
  const [itensPedido, setItensPedido] = useState([]); // [{ fk_componente, quantidade }]
  const [loadingComponentes, setLoadingComponentes] = useState(false);

  React.useEffect(() => {
    console.log("[OrderFormModal] Pedido recebido:", pedido);
    if (pedido) {
      setForm({
        codigo: pedido.codigo || "",
        cnpj: pedido.cnpj || pedido.CNPJ || "",
        ddd: pedido.ddd || pedido.DDD || "",
        nomeComprador: pedido.nomeComprador || pedido.nomeComprador || "",
        emailComprador: pedido.emailComprador || pedido.emailComprador || "",
        telCelular: pedido.telCelular || pedido.telCelular || "",
        status: pedido.status || "EM_ANALISE",
        valor: pedido.valor || ""
      });
      // Busca itens do pedido na API ao editar
      if (pedido.idPedido || pedido.id_pedido || pedido.id) {
        const id = pedido.idPedido || pedido.id_pedido || pedido.id;
        api.get('/items').then(resp => {
          const itens = resp.data.data || resp.data || [];
          const itensDoPedido = itens.filter(item => item.fkPedido && String(item.fkPedido.idPedido) === String(id));
          setItensPedido(itensDoPedido.map(i => ({
            fk_componente: i.fkComponente?.idComponente || i.fk_componente || i.fkComponente,
            quantidade: i.quantidade
          })));
        }).catch(() => setItensPedido([]));
      } else {
        setItensPedido([]);
      }
    } else {
      setForm(initialForm);
      setItensPedido([]);
    }
  }, [pedido, open]);

  // Buscar componentes ao abrir modal
  useEffect(() => {
    if (open) {
      setLoadingComponentes(true);
      api.get("/components")
        .then(res => {
          let data = res.data.data || res.data;
          setComponentes(Array.isArray(data) ? data : []);
        })
        .catch(() => setComponentes([]))
        .finally(() => setLoadingComponentes(false));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Adicionar item ao pedido
  const handleAddItem = (fk_componente) => {
    if (!itensPedido.some(i => i.fk_componente === fk_componente)) {
      setItensPedido([...itensPedido, { fk_componente, quantidade: 1 }]);
    }
  };
  // Remover item do pedido
  const handleRemoveItem = (fk_componente) => {
    setItensPedido(itensPedido.filter(i => i.fk_componente !== fk_componente));
  };
  // Alterar quantidade
  const handleChangeQuantidade = (fk_componente, quantidade) => {
    setItensPedido(itensPedido.map(i => i.fk_componente === fk_componente ? { ...i, quantidade: Math.max(1, Number(quantidade) || 1) } : i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (form.status === "CONCLUIDO") {

        const res = await api.get("/components");
        const componentesEstoque = Array.isArray(res.data.data) ? res.data.data : res.data;
        for (const item of itensPedido) {
          const compId = item.fk_componente?.idComponente || item.fk_componente || item.fkComponente;
          const comp = componentesEstoque.find(c => String(c.idComponente) === String(compId));
          if (!comp) {
            setError(`Não é possível concluir o pedido: componente de id ${compId} não encontrado no estoque.`);
            setLoading(false);
            return;
          }
          if (Number(item.quantidade) > Number(comp.quantidade)) {
            setError(`Não é possível concluir o pedido: o item "${comp.partNumber || comp.descricao || compId}" excede o estoque disponível.`);
            setLoading(false);
            return;
          }
        }
      }
      const payload = {
        codigo: form.codigo,
        cnpj: form.cnpj,
        ddd: parseInt(form.ddd, 10),
        nomeComprador: form.nomeComprador,
        emailComprador: form.emailComprador,
        telCelular: parseInt(form.telCelular, 10),
        status: form.status,
        valor: form.valor
      };
      console.log("[OrderFormModal] Payload enviado:", payload);
      let response;
      if (pedido && (pedido.id_pedido || pedido.idPedido)) {
        const id = pedido.id_pedido || pedido.idPedido;
        response = await api.put(`/orders/${id}`, payload);
        // Busca todos os itens do pedido
        const itensResp = await api.get('/items');
        const itensAll = itensResp.data.data || itensResp.data || [];
        const itensDoPedido = itensAll.filter(item => item.fkPedido && String(item.fkPedido.idPedido) === String(id));

        // Atualiza ou deleta cada item antigo
        for (const itemAntigo of itensDoPedido) {
          const atualizado = itensPedido.find(i => String(i.fk_componente) === String(itemAntigo.fkComponente?.idComponente || itemAntigo.fk_componente || itemAntigo.fkComponente));
          if (atualizado) {
            // Atualiza quantidade
            await api.put(`/items/${itemAntigo.idItem || itemAntigo.id}`, {
              fkPedido: id,
              fkComponente: atualizado.fk_componente,
              quantidade: atualizado.quantidade
            });
          } else {
            // Remove item que foi excluído
            await api.delete(`/items/${itemAntigo.idItem || itemAntigo.id}`);
          }
        }
        // Cria novos itens que não existiam antes
        for (const itemNovo of itensPedido) {
          const jaExiste = itensDoPedido.find(i => String(i.fkComponente?.idComponente || i.fk_componente || i.fkComponente) === String(itemNovo.fk_componente));
          if (!jaExiste) {
            await api.post("/items", [{
              fkPedido: id,
              fkComponente: itemNovo.fk_componente,
              quantidade: itemNovo.quantidade
            }]);
          }
        }
        console.log("[OrderFormModal] Resposta PUT:", response?.data);
      } else {
        response = await api.post("/orders", payload);
        console.log("[OrderFormModal] Resposta POST pedido:", response?.data);
        // Após criar pedido, criar itens
        const pedidoId = response?.data?.data?.idPedido || response?.data?.data?.id_pedido || response?.data?.data?.id;
        if (!pedidoId) {
          setError("Erro: não foi possível obter o ID do pedido criado.");
          setLoading(false);
          return;
        }
        const itensPayload = itensPedido.map(item => ({
          fkPedido: pedidoId,
          fkComponente: item.fk_componente,
          quantidade: item.quantidade
        }));
        if (itensPayload.length > 0) {
          await api.post("/items", itensPayload);
        }
        console.log("[OrderFormModal] Resposta POST:", response?.data);
      }
      setForm(initialForm);
      setItensPedido([]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("[OrderFormModal] Erro na requisição:", err);
      setError(err?.response?.data?.message || "Erro ao salvar pedido.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{pedido ? 'Editar Pedido' : 'Novo Pedido'}</DialogTitle>
      <DialogContent>
        {/* Selecionador de tipo de pessoa */}
        <Box sx={{ mb: 2 }}>
          <FormLabel id="tipo-pessoa-label">Tipo de Pessoa</FormLabel>
          <RadioGroup
            row
            aria-labelledby="tipo-pessoa-label"
            name="tipoPessoa"
            value={tipoPessoa}
            onChange={e => {
              setTipoPessoa(e.target.value);
              setForm(prev => ({ ...prev, cnpj: '' }));
            }}
            disabled={!!pedido} // Desabilita se estiver editando
          >
            <FormControlLabel
              value="empresa"
              control={<Radio sx={{ color: '#61131A', '&.Mui-checked': { color: '#61131A' } }} />}
              label="Empresa (CNPJ)"
              disabled={!!pedido}
            />
            <FormControlLabel
              value="pf"
              control={<Radio sx={{ color: '#61131A', '&.Mui-checked': { color: '#61131A' } }} />}
              label="Pessoa Física (CPF)"
              disabled={!!pedido}
            />
          </RadioGroup>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Código"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label={tipoPessoa === 'empresa' ? 'CNPJ' : 'CPF'}
            name="cnpj"
            value={form.cnpj}
            onChange={e => {
              // Permitir apenas números e limitar a 14 para CNPJ ou 11 para CPF
              const maxLen = tipoPessoa === 'empresa' ? 14 : 11;
              const value = e.target.value.replace(/\D/g, '').slice(0, maxLen);
              setForm(prev => ({ ...prev, cnpj: value }));
            }}
            required
            fullWidth
            inputProps={{ maxLength: tipoPessoa === 'empresa' ? 14 : 11, inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          <TextField
            label="DDD"
            name="ddd"
            value={form.ddd}
            onChange={handleChange}
            required
            fullWidth
            type="number"
          />
          <TextField
            label="Nome do Comprador"
            name="nomeComprador"
            value={form.nomeComprador}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email do Comprador"
            name="emailComprador"
            value={form.emailComprador}
            onChange={handleChange}
            required
            fullWidth
            type="email"
          />
          <TextField
            label="Telefone Celular"
            name="telCelular"
            value={form.telCelular}
            onChange={handleChange}
            required
            fullWidth
            type="number"
          />
          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            fullWidth
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            required
            fullWidth
            type="text"
          />
          {error && <Box color="error.main">{error}</Box>}
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <FormLabel>Itens do Pedido</FormLabel>
          {loadingComponentes ? (
            <Box sx={{ my: 2 }}><CircularProgress size={22} /></Box>
          ) : (
            <>
              <TextField
                select
                label="Adicionar Componente"
                value=""
                onChange={e => handleAddItem(Number(e.target.value))}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>Selecione um componente</MenuItem>
                {componentes.map(c => (
                  <MenuItem key={c.idComponente} value={c.idComponente} disabled={itensPedido.some(i => i.fk_componente === c.idComponente)}>
                    {c.partNumber} - {c.descricao || c.idHardWareTech}
                  </MenuItem>
                ))}
              </TextField>
              {itensPedido.length === 0 && <Box sx={{ color: '#888', fontSize: 13, mb: 1 }}>Nenhum item adicionado.</Box>}
              {itensPedido.map(item => {
                const comp = componentes.find(c => c.idComponente === item.fk_componente);
                return (
                  <Box key={item.fk_componente} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, border: '1px solid #eee', borderRadius: 1, bgcolor: 'transparent', p: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <b>{comp?.partNumber || comp?.idHardWareTech}</b> <span style={{ color: '#888' }}>{comp?.descricao}</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden', bgcolor: '#faf9f7', height: 36 }}>
                      <Button
                        variant="text"
                        size="small"
                        sx={{ minWidth: 32, px: 0, fontWeight: 700, color: '#61131A', borderRadius: 0, height: '100%' }}
                        onClick={() => handleChangeQuantidade(item.fk_componente, Number(item.quantidade) - 1)}
                        disabled={Number(item.quantidade) <= 1}
                      >
                        -
                      </Button>
                      <TextField
                        type="number"
                        value={item.quantidade}
                        onChange={e => {
                          let value = e.target.value.replace(/\D/g, '');
                          value = value === '' ? 1 : Math.max(1, Number(value));
                          handleChangeQuantidade(item.fk_componente, value);
                        }}
                        inputProps={{ min: 1, style: { textAlign: 'center', width: 48, fontWeight: 600, fontSize: 16, padding: 0, MozAppearance: 'textfield' }, inputMode: 'numeric', pattern: '[0-9]*' }}
                        size="small"
                        sx={{ mx: 0, bgcolor: 'transparent', '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 }, '& input[type=number]': { MozAppearance: 'textfield' } }}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                      <Button
                        variant="text"
                        size="small"
                        sx={{ minWidth: 32, px: 0, fontWeight: 700, color: '#61131A', borderRadius: 0, height: '100%' }}
                        onClick={() => handleChangeQuantidade(item.fk_componente, Number(item.quantidade) + 1)}
                      >
                        +
                      </Button>
                    </Box>
                    <Button color="error" size="small" onClick={() => handleRemoveItem(item.fk_componente)}>Remover</Button>
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ bgcolor: '#61131A', '&:hover': { bgcolor: '#4e0f15' } }}>
          {loading ? <CircularProgress size={22} /> : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderFormModal;

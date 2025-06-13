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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const initialForm = {
  codigo: "",
  cnpj: "",
  nomeComprador: "",
  emailComprador: "",
  telCelular: "",
  status: "PENDENTE",
  valor: ""
};

const statusOptions = [
  { value: "CONCLUIDO", label: "CONCLUÍDO" },
  { value: "PENDENTE", label: "PENDENTE" },
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
  const [feedbackMessage, setFeedbackMessage] = useState({ open: false, message: '', severity: 'error' });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [validatedItems, setValidatedItems] = useState(null);

  useEffect(() => {
    console.log("[OrderFormModal] Pedido recebido:", pedido);

    if (pedido) {
      const cnpjValue = pedido.cnpj || pedido.CNPJ || "";
      // Detecta tipo de pessoa automaticamente
      if (cnpjValue && cnpjValue.replace(/\D/g, '').length === 11) {
        setTipoPessoa('pf');
      } else if (cnpjValue && cnpjValue.replace(/\D/g, '').length === 14) {
        setTipoPessoa('empresa');
      }
      setForm({
        codigo: pedido.codigo || "",
        cnpj: cnpjValue,
        nomeComprador: pedido.nomeComprador || pedido.nomeComprador || "",
        emailComprador: pedido.emailComprador || pedido.emailComprador || "",
        telCelular: pedido.telCelular || pedido.telCelular || "",
        status: pedido.status || "PENDENTE",
        valor: pedido.valor || ""
      });
      // Detecta tipoPessoa com base no tamanho do cnpj/cpf
      const cnpjCpf = (pedido.cnpj || pedido.CNPJ || "").replace(/\D/g, "");
      if (cnpjCpf.length === 11) {
        setTipoPessoa("pf");
      } else {
        setTipoPessoa("empresa");
      }
      // Busca itens do pedido na API ao editar
      if (pedido.idPedido || pedido.id_pedido || pedido.id) {
        const id = pedido.idPedido || pedido.id_pedido || pedido.id;
        api.get('/items').then(resp => {
          const itens = resp.data.data || resp.data || [];
          const itensDoPedido = itens.filter(item => item.fkPedido && String(item.fkPedido.idPedido) === String(id));
          setItensPedido(itensDoPedido.map(i => ({
            fk_componente: i.fkComponente?.idComponente || i.fk_componente || i.fkComponente,
            quantidade: i.quantidadeCarrinho // Atualizado para refletir o novo nome do campo
          })));
        }).catch(() => setItensPedido([]));
      } else {
        setItensPedido([]);
      }
    } else {
      setForm(initialForm);
      setItensPedido([]);
      setTipoPessoa("empresa"); // volta ao padrão ao criar novo
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
    // Validação manual dos campos obrigatórios
    if (!form.codigo || !form.cnpj || !form.nomeComprador || !form.emailComprador || !form.telCelular || !form.status || !form.valor) {
      setFeedbackMessage({ open: true, message: "Preencha todos os campos obrigatórios antes de salvar.", severity: 'error' });
      setLoading(false);
      return;
    }
    // Bloqueia salvar se não houver itens no pedido
    if (itensPedido.length === 0) {
      setFeedbackMessage({ open: true, message: "Adicione pelo menos um item ao pedido antes de salvar.", severity: 'error' });
      setLoading(false);
      return;
    }
    try {
      if (form.status === "CONCLUIDO") {
        const res = await api.get("/components");
        const componentesEstoque = Array.isArray(res.data.data) ? res.data.data : res.data;
        for (const item of itensPedido) {
          const compId = item.fk_componente?.idComponente || item.fk_componente || item.fkComponente;
          const comp = componentesEstoque.find(c => String(c.idComponente) === String(compId));
          if (!comp) {
            setFeedbackMessage({ open: true, message: `Não é possível concluir o pedido: componente de id ${compId} não encontrado no estoque.`, severity: 'error' });
            setLoading(false);
            return;
          }
          if (Number(item.quantidade) > Number(comp.quantidade)) {
            setFeedbackMessage({ open: true, message: `Não é possível concluir o pedido: o item "${comp.partNumber || comp.descricao || compId}" excede o estoque disponível.`, severity: 'error' });
            setLoading(false);
            return;
          }
        }
        // If status is CONCLUIDO and stock validation passed, store the validated items and show confirmation
        setValidatedItems(componentesEstoque);
        setShowConfirmationModal(true);
        setLoading(false);
        return;
      }
      
      // For other statuses, continue with the normal flow
      await saveOrder();
    } catch (err) {
      setFeedbackMessage({ open: true, message: err?.response?.data?.message || "Erro ao salvar pedido.", severity: 'error' });
      setError(err?.response?.data?.message || "Erro ao salvar pedido.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setError("");
    onClose();
  };

  const formatCnpjCpf = (value) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length === 14) {
      // CNPJ: 00.000.000/0000-00
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else if (digits.length === 11) {
      // CPF: 000.000.000-00
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };
  const formatPhone = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, '');
    return value.replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const saveOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        codigo: form.codigo,
        cnpj: form.cnpj.replace(/\D/g, ''),
        nomeComprador: form.nomeComprador,
        emailComprador: form.emailComprador,
        telCelular: parseInt(form.telCelular.replace(/\D/g, ''), 10),
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
              quantidadeCarrinho: atualizado.quantidade // Atualizado para refletir o novo nome do campo
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
              quantidadeCarrinho: itemNovo.quantidade // Atualizado para refletir o novo nome do campo
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
          quantidadeCarrinho: item.quantidade // Atualizado para refletir o novo nome do campo
        }));
        if (itensPayload.length > 0) {
          await api.post("/items", itensPayload);
        }
        console.log("[OrderFormModal] Resposta POST:", response?.data);
      }

      // Se o pedido for CONCLUIDO, atualiza o estoque dos componentes
      if (form.status === "CONCLUIDO") {
        try {
          // Busca componentes atuais
          const resComp = await api.get("/components");
          const listaComponentes = Array.isArray(resComp.data.data) ? resComp.data.data : resComp.data;
          for (const item of itensPedido) {
            const compId = item.fk_componente;
            const componente = listaComponentes.find(c => String(c.idComponente) === String(compId));
            if (componente) {
              const novaQuantidade = Math.max(0, parseInt(componente.quantidade, 10) - parseInt(item.quantidade, 10));
              // Monta objeto conforme ComponentRequestDTO
              const componentData = {
                idHardWareTech: componente.idHardWareTech,
                nomeComponente: componente.nomeComponente,
                partNumber: componente.partNumber,
                descricao: componente.descricao,
                quantidade: novaQuantidade,
                fkCaixa: componente.fkCaixa?.idCaixa || componente.caixa?.idCaixa || componente.caixa,
                fkCategoria: componente.fkCategoria?.idCategoria || componente.fkCategoria?.id || componente.fkCategoria,
                flagVerificado: componente.flagVerificado,
                condicao: componente.condicao,
                observacao: componente.observacao,
                flagML: componente.flagML,
                codigoML: componente.codigoML,
                imagem: componente.imagem
              };

              // Só inclui isVisibleCatalog se não for undefined
              if (typeof componente.isVisibleCatalog !== 'undefined') {
                componentData.isVisibleCatalog = componente.isVisibleCatalog === null ? false : componente.isVisibleCatalog;
              }
              
              const formData = new FormData();
              formData.append('data', new Blob([JSON.stringify(componentData)], { type: 'application/json' }));
             
              await api.put(`/components/${compId}`, formData);
            }
          }
          setFeedbackMessage({
            open: true,
            message: "Pedido concluído e estoque atualizado com sucesso!",
            severity: 'success'
          });
        } catch (errEstoque) {
          setFeedbackMessage({
            open: true,
            message: "Pedido salvo, mas houve erro ao atualizar o estoque. Verifique manualmente.",
            severity: 'warning'
          });
        } 
      }
      setForm(initialForm);
      setItensPedido([]);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setFeedbackMessage({ open: true, message: err?.response?.data?.message || "Erro ao salvar pedido.", severity: 'error' });
      setError(err?.response?.data?.message || "Erro ao salvar pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 8,
          background: 'linear-gradient(90deg, #f8fafc 60%, #f0f2f5 100%)',
          p: 0
        }
      }}>
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          background: 'linear-gradient(90deg, #f8fafc 60%, #f0f2f5 100%)',
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#61131A',
          py: 2,
        }}>
          <Box sx={{
            backgroundColor: '#61131A',
            width: 32,
            height: 32,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" fill="#fff" stroke="#61131A" strokeWidth="2"/><path d="M7 9h10M7 13h6" stroke="#61131A" strokeWidth="2" strokeLinecap="round"/></svg>
          </Box>
          {pedido ? 'Editar Pedido' : 'Novo Pedido'}
        </DialogTitle>
        <DialogContent sx={{
          background: 'linear-gradient(90deg, #f8fafc 60%, #f0f2f5 100%)',
          px: 3,
          py: 2.5,
        }}>
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
              disabled={!!pedido}
              sx={{ ml: 1 }}
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
              InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              sx={{ bgcolor: '#fff' }}
              disabled={!!pedido}
            />
            <TextField
              label={tipoPessoa === 'empresa' ? 'CNPJ' : 'CPF'}
              name="cnpj"
              value={formatCnpjCpf(form.cnpj)}
              onChange={e => {
                let value = e.target.value.replace(/\D/g, '');
                const maxLen = tipoPessoa === 'empresa' ? 14 : 11;
                value = value.slice(0, maxLen);
                setForm(prev => ({ ...prev, cnpj: value }));
              }}
              required
              fullWidth
              inputProps={{ maxLength: tipoPessoa === 'empresa' ? 18 : 14, inputMode: 'text', pattern: '[0-9.\-/]*' }}
              InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              sx={{ bgcolor: '#fff' }}
              disabled={!!pedido}
            />
            <TextField
              label="Nome do Comprador"
              name="nomeComprador"
              value={form.nomeComprador}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              sx={{ bgcolor: '#fff' }}
              disabled={!!pedido}
            />
            <TextField
              label="Email do Comprador"
              name="emailComprador"
              value={form.emailComprador}
              onChange={handleChange}
              required
              fullWidth
              type="email"
              InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              sx={{ bgcolor: '#fff' }}
              disabled={!!pedido}
            />
            <TextField
              label="Telefone Celular"
              name="telCelular"
              value={formatPhone(form.telCelular)}
              onChange={e => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.slice(0, 11);
                setForm(prev => ({ ...prev, telCelular: value }));
              }}
              required
              fullWidth
              type="text"
              inputProps={{ maxLength: 15, inputMode: 'text', pattern: '[0-9()\- ]*' }}
              InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              sx={{ bgcolor: '#fff' }}
              disabled={!!pedido}
            />
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              sx={{ bgcolor: '#fff' }}
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
              InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
              InputLabelProps={{ sx: { fontSize: '1rem' } }}
              sx={{ bgcolor: '#fff' }}
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
                  sx={{ mb: 2, bgcolor: '#fff' }}
                  InputProps={{ sx: { borderRadius: 2, fontSize: '1rem' } }}
                  InputLabelProps={{ sx: { fontSize: '1rem' } }}
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
                    <Box key={item.fk_componente} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fff', p: 1 }}>
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
                            value = value ? Math.max(1, Number(value)) : 1;
                            handleChangeQuantidade(item.fk_componente, value);
                          }}
                          inputProps={{ min: 1, style: { textAlign: 'center', width: 40, fontWeight: 600, fontSize: '1rem', MozAppearance: 'textfield' }, step: 1 }}
                          sx={{ width: 60, mx: 0.5, bgcolor: '#fff', '& input': { textAlign: 'center' } }}
                          size="small"
                          InputProps={{ inputProps: { style: { MozAppearance: 'textfield', textAlign: 'center' } }, sx: { '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 }, '& input[type=number]': { MozAppearance: 'textfield', textAlign: 'center' } } }}
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
                      <Button color="error" size="small" onClick={() => handleRemoveItem(item.fk_componente)} sx={{ ml: 1, fontWeight: 600, color: '#b71c1c', textTransform: 'none' }}>Remover</Button>
                    </Box>
                  );
                })}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{
          background: '#f8fafc',
          borderTop: '1px solid #e0e0e0',
          py: 2,
          px: 3,
          justifyContent: 'center',
        }}>
          <Button onClick={handleClose} disabled={loading} sx={{
            borderRadius: '4px',
            textTransform: 'none',
            fontWeight: 700,
            px: 4,
            bgcolor: '#fff',
            color: '#61131A',
            fontSize: '1rem',
            border: '1px solid #61131A',
            boxShadow: '0 2px 8px rgba(97,19,26,0.04)',
            '&:hover': { bgcolor: '#f5e9eb' }
          }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{
            borderRadius: '4px',
            textTransform: 'none',
            fontWeight: 700,
            px: 4,
            bgcolor: '#61131A',
            color: '#fff',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(97,19,26,0.08)',
            '&:hover': { bgcolor: '#4e0f15' }
          }}>
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : "Salvar"}
          </Button>
        </DialogActions>
        {/* Snackbar para feedback de erro */}
        <Snackbar
          open={feedbackMessage.open}
          autoHideDuration={5000}
          onClose={() => setFeedbackMessage(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setFeedbackMessage(prev => ({ ...prev, open: false }))}
            severity={feedbackMessage.severity}
            variant="filled"
            sx={{ width: '100%', maxWidth: '400px', fontSize: '0.9rem' }}
          >
            {feedbackMessage.message}
          </Alert>
        </Snackbar>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 8,
            background: '#fff', // fundo branco
            p: 0
          }
        }}
      >
        <DialogTitle sx={{
          fontSize: '1.2rem',
          pb: 0,
          textAlign: 'center',
          background: '#fff', // fundo branco
          borderBottom: '1px solid #f8d7da'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 4 }}>
              <circle cx="12" cy="12" r="12" fill="#61131A" fillOpacity="0.12" />
              <path d="M12 8v4m0 4h.01" stroke="#61131A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Confirmar conclusão do pedido
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 2, background: '#fff' }}>
          <Box sx={{ my: 1, textAlign: 'center' }}>
            <Box sx={{ fontSize: '1.05rem', color: '#61131A', fontWeight: 600, mb: 1 }}>
              Tem certeza que deseja <b>concluir</b> este pedido?
            </Box>
            <Box sx={{ color: '#222', fontWeight: 700, fontSize: '1rem', mt: 1, letterSpacing: 0.2, background: '#f5f5f5', borderRadius: 1, px: 1, py: 0.5, display: 'inline-block' }}>
              Esta ação não poderá ser desfeita e os itens serão descontados do estoque.
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3, pl: 3, justifyContent: 'center', background: '#fff' }}>
          <Button
            onClick={() => setShowConfirmationModal(false)}
            sx={{
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              bgcolor: '#fff',
              color: '#61131A',
              fontSize: '1rem',
              border: '1px solid #61131A',
              boxShadow: '0 2px 8px rgba(97,19,26,0.04)',
              '&:hover': { bgcolor: '#f5e9eb' }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setShowConfirmationModal(false);
              saveOrder();
            }}
            variant="contained"
            color="error"
            sx={{ bgcolor: '#61131A', '&:hover': { bgcolor: '#4e0f15' }, fontWeight: 600, borderRadius: '4px', textTransform: 'none', px: 4 }}
          >
            Confirmar Conclusão
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderFormModal;

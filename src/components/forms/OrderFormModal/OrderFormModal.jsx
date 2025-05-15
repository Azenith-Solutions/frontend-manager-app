import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box
} from "@mui/material";
import { api } from "../../../provider/apiProvider";

const initialForm = {
  codigo: "",
  fkEmpresa: "",
  nomeComprador: "",
  emailComprador: "",
  telCelular: "",
  status: "PENDENTE"
};

const statusOptions = [
  { value: "PENDENTE", label: "PENDENTE" },
  { value: "APROVADO", label: "APROVADO" },
  { value: "ENTREGUE", label: "ENTREGUE" }
];

const OrderFormModal = ({ open, onClose, onSuccess, pedido }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (pedido) {
      let fkEmpresaValue = "";
      const empresa = pedido.fkEmpresa;
      if (empresa && typeof empresa === "object" && empresa !== null) {
        if (empresa.idEmpresa !== undefined) {
          fkEmpresaValue = empresa.idEmpresa.toString();
        } else if (empresa.id !== undefined) {
          fkEmpresaValue = empresa.id.toString();
        } else if (typeof empresa === "number" || typeof empresa === "string") {
          fkEmpresaValue = empresa.toString();
        }
      } else if (typeof empresa === "number" || typeof empresa === "string") {
        fkEmpresaValue = empresa.toString();
      }
      setForm({
        codigo: pedido.codigo || "",
        fkEmpresa: fkEmpresaValue || "",
        nomeComprador: pedido.nomeComprador || "",
        emailComprador: pedido.emailComprador || "",
        telCelular: pedido.telCelular || "",
        status: pedido.status || "PENDENTE"
      });
    } else {
      setForm(initialForm);
    }
  }, [pedido, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        codigo: form.codigo,
        fkEmpresa: form.fkEmpresa ? Number(form.fkEmpresa) : undefined,
        nomeComprador: form.nomeComprador,
        emailComprador: form.emailComprador,
        telCelular: form.telCelular,
        status: form.status
      };
      console.log('Payload enviado para /orders:', payload);
      if (pedido && pedido.idPedido) {
        await api.put(`/orders/${pedido.idPedido}`, payload);
      } else {
        await api.post("/orders", payload);
      }
      setForm(initialForm);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar pedido:', err?.response || err);
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
            label="ID da Empresa"
            name="fkEmpresa"
            value={form.fkEmpresa}
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
          {error && <Box color="error.main">{error}</Box>}
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

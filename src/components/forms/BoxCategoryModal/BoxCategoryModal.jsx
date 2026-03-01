import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InboxIcon from "@mui/icons-material/Inbox";
import CategoryIcon from "@mui/icons-material/Category";
import { api } from "../../../service/api";

const config = {
  box: {
    title: "Gerenciar Caixas",
    icon: <InboxIcon sx={{ color: "#61131A" }} />,
    endpoint: "/boxes",
    nameLabel: "Nome da caixa",
    namePlaceholder: "Ex: CAIXA 01",
    itemLabel: "Caixa",
    idField: "id",
    nameField: "caixa",
  },
  category: {
    title: "Gerenciar Categorias",
    icon: <CategoryIcon sx={{ color: "#61131A" }} />,
    endpoint: "/categorys",
    nameLabel: "Nome da categoria",
    namePlaceholder: "Ex: Resistores",
    itemLabel: "Categoria",
    idField: "id",
    nameField: "categoria",
  },
};

const BoxCategoryModal = ({ open, onClose, onSuccess, type = "box" }) => {
  const cfg = config[type];

  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get(cfg.endpoint);
      const data = response.data.data || response.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar itens:", err);
      setError("Erro ao carregar itens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchItems();
      setNewName("");
      setError("");
    }
  }, [open, type]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      await api.post(cfg.endpoint, { nome: newName.trim() });
      setNewName("");
      setSnackbar({ open: true, message: `${cfg.itemLabel} criada com sucesso!`, severity: "success" });
      await fetchItems();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erro ao criar:", err);
      setError(err.response?.data?.message || "Erro ao criar item.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setError("");
      await api.delete(`${cfg.endpoint}/${id}`);
      setSnackbar({ open: true, message: `${cfg.itemLabel} excluída com sucesso!`, severity: "success" });
      await fetchItems();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      const message = err.response?.status === 500
        ? `Não é possível excluir esta ${cfg.itemLabel.toLowerCase()} pois ela está em uso.`
        : err.response?.data?.message || "Erro ao excluir item.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !creating) {
      handleCreate();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "8px" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
            pb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {cfg.icon}
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
              {cfg.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 2, mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Criar novo */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              size="small"
              label={cfg.nameLabel}
              placeholder={cfg.namePlaceholder}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              disabled={creating}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#61131A",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#61131A",
                },
              }}
            />
            <Button
              variant="contained"
              disableElevation
              startIcon={creating ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              sx={{
                bgcolor: "#61131A",
                "&:hover": { bgcolor: "#4e0f15" },
                textTransform: "none",
                fontWeight: 600,
                minWidth: "120px",
                whiteSpace: "nowrap",
              }}
            >
              Adicionar
            </Button>
          </Box>

          {/* Lista existente */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#61131A" }} />
            </Box>
          ) : items.length === 0 ? (
            <Typography
              sx={{ textAlign: "center", color: "#666", py: 4, fontSize: "0.875rem" }}
            >
              Nenhum item cadastrado.
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 300, borderRadius: "6px" }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: "#444",
                        bgcolor: "#f5f5f7",
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: "#444",
                        bgcolor: "#f5f5f7",
                      }}
                    >
                      Nome
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: "#444",
                        bgcolor: "#f5f5f7",
                        width: "60px",
                      }}
                    >
                      Ação
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item[cfg.idField]}
                      sx={{
                        "&:hover": { bgcolor: "rgba(97,19,26,0.04)" },
                        "&:nth-of-type(odd)": { bgcolor: "rgba(0,0,0,0.02)" },
                      }}
                    >
                      <TableCell sx={{ fontSize: "0.8rem", color: "#555" }}>
                        {item[cfg.idField]}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                        {item[cfg.nameField]}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={`Excluir ${cfg.itemLabel.toLowerCase()}`}>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item[cfg.idField])}
                            disabled={deletingId === item[cfg.idField]}
                            sx={{
                              color: "#e74c3c",
                              "&:hover": { bgcolor: "rgba(231,76,60,0.08)" },
                            }}
                          >
                            {deletingId === item[cfg.idField] ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography
            sx={{
              mt: 1.5,
              fontSize: "0.7rem",
              color: "#999",
              textAlign: "right",
            }}
          >
            {items.length} {items.length === 1 ? "item" : "itens"} cadastrados
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BoxCategoryModal;

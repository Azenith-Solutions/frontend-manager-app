import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/**
 * Modal de confirmação para alteração de visibilidade no catálogo
 */
const CatalogVisibilityModal = ({ open, onClose, component, newVisibility, onConfirm, isLoading }) => {
  // Se não houver componente, não renderiza
  if (!component) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="catalog-visibility-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="catalog-visibility-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {newVisibility ? (
            <VisibilityIcon sx={{ color: '#27ae60' }} />
          ) : (
            <VisibilityOffIcon sx={{ color: '#e74c3c' }} />
          )}
          <Typography variant="h6">
            {newVisibility ? "Mostrar componente no catálogo?" : "Ocultar componente do catálogo?"}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você está prestes a {newVisibility ? "mostrar" : "ocultar"} o componente <strong>{component.nomeComponente || component.partNumber}</strong> (IDH: {component.idHardWareTech}) {newVisibility ? "no" : "do"} catálogo. 
          {newVisibility 
            ? " Isso tornará o componente visível para todos os usuários."
            : " Isso tornará o componente invisível para os usuários."}
        </DialogContentText>
        <Box sx={{ mt: 2, p: 2, bgcolor: newVisibility ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: newVisibility ? '#27ae60' : '#e74c3c' }}>
            Status atual: <strong>{component.isVisibleCatalog ? "Visível" : "Oculto"}</strong>
            <br />
            Novo status: <strong>{newVisibility ? "Visível" : "Oculto"}</strong>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={newVisibility ? "success" : "error"}
          disabled={isLoading}
          autoFocus
        >
          {isLoading ? "Processando..." : newVisibility ? "Mostrar no catálogo" : "Ocultar do catálogo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CatalogVisibilityModal;
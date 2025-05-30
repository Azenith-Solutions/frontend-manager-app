
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../../../service/api';

const ComponentDeleteModal = ({ open, onClose, component, onComponentDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Função para excluir o componente
  const handleDelete = async () => {
    if (!component || (!component.id && !component.idComponente)) {
      setSnackbar({
        open: true,
        message: 'Erro: ID do componente não encontrado',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);

      // Endpoint de exclusão de componente
      const componentId = component.idComponente || component.id;
      const response = await api.delete(`/components/${componentId}`);

      // Indica que a exclusão foi bem-sucedida
      setDeleteSuccess(true);
      setSnackbar({
        open: true,
        message: `Componente ${component?.partNumber || component?.idHardWareTech || "selecionado"} excluído com sucesso!`,
        severity: 'success'
      });

      setTimeout(() => {
        setTimeout(() => {
          setDeleteSuccess(false);
          setLoading(false);
          if (onComponentDeleted) {
            onComponentDeleted();
          }
          onClose();
        }, 1000);
      }, 1500);

    } catch (error) {
      console.error('Erro ao excluir componente:', error);

      let errorMessage = 'Erro ao excluir componente. Tente novamente.';

      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          errorMessage = 'Componente não encontrado.';
          if (data.data && Array.isArray(data.data)) {
            errorMessage = data.data.join('\n');
          }
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  // Função para fechar o snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          maxHeight: '250px'
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: '#f5f5f7',
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              backgroundColor: '#61131A',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DeleteIcon sx={{ color: 'white', fontSize: '16px' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#333' }}>
            Excluir Componente
          </Typography>
        </Box>
        <IconButton
          edge="end"
          onClick={onClose}
          aria-label="close"
          disabled={loading || deleteSuccess}
          sx={{
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              color: '#c0392b'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 1.75, position: 'relative' }}>
        {/* Overlay de sucesso */}
        {deleteSuccess && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              gap: 0.5,
              borderRadius: '4px'
            }}
          >
            <DeleteIcon
              sx={{
                fontSize: 36,
                color: '#61131A',
                animation: 'fadeIn 1s',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 }
                }
              }}
            />
            <Typography variant="subtitle1" sx={{ color: '#61131A', fontWeight: 600, fontSize: '0.85rem' }}>
              Componente excluído com sucesso!
            </Typography>
            <CircularProgress size={18} sx={{ mt: 0.5, color: '#61131A' }} />
          </Box>
        )}
        <Typography variant="body1" color="text.primary" sx={{ mb: 1, mt: 0.75, fontWeight: 500, textAlign: 'center', fontSize: '0.9rem' }}>
          Deseja excluir o componente <strong>{component?.partNumber || component?.idHardWareTech || "selecionado"}</strong>?
        </Typography>
        <Box
          sx={{
            mt: 1.5,
            p: 1.25,
            borderRadius: '6px',
            backgroundColor: 'rgba(97, 19, 26, 0.08)',
            border: '1px solid rgba(97, 19, 26, 0.2)'
          }}
        >
          <Typography variant="body2" sx={{ color: '#61131A', fontSize: '0.75rem' }}>
            Confirme esta ação apenas se você tem certeza que deseja remover este componente do sistema.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{
        p: 1.5,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'center',
        gap: 1.5
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          disabled={loading || deleteSuccess}
          sx={{
            textTransform: 'none',
            borderRadius: '6px',
            color: '#666',
            borderColor: '#d1d1d1',
            fontSize: '0.875rem',
            minWidth: '100px',
            py: 0.75,
            '&:hover': {
              borderColor: '#999',
              backgroundColor: 'rgba(0,0,0,0.03)'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          disableElevation
          size="small"
          onClick={handleDelete}
          disabled={loading || deleteSuccess}
          sx={{
            textTransform: 'none',
            bgcolor: '#61131A',
            '&:hover': { bgcolor: '#4e0f15' },
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: '140px',
            py: 0.75,
            position: 'relative',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={20}
                sx={{
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-10px',
                  marginLeft: '-10px',
                }}
              />
              <span style={{ visibility: 'hidden' }}>Excluir Componente</span>
            </>
          ) : deleteSuccess ? (
            'Componente Excluído'
          ) : (
            'Excluir Componente'
          )}
        </Button>
      </DialogActions>
      {/* Snackbar para mensagens de sucesso/erro */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.severity === 'success' ? 5000 : 6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            whiteSpace: 'pre-wrap',
            maxWidth: '400px',
            fontSize: '0.9rem'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ComponentDeleteModal;

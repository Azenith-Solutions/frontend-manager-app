import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserFormModal = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#f5f5f7', 
        p: 2,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            sx={{ 
              backgroundColor: '#61131A',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <PersonAddIcon sx={{ color: 'white', fontSize: '18px' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#333' }}>
            Novo Usuário
          </Typography>
        </Box>
        <IconButton 
          edge="end" 
          onClick={onClose} 
          aria-label="close"
          sx={{ 
            color: '#666',
            '&:hover': { 
              backgroundColor: 'rgba(0,0,0,0.05)', 
              color: '#61131A' 
            } 
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Preencha os campos abaixo para criar um novo usuário no sistema. Todos os campos são obrigatórios.
        </Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Primeira linha: Nome e Cargo lado a lado */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              autoFocus
              label="Nome completo"
              variant="outlined"
              size="small"
              required
              sx={{ flex: 1 }}
              InputProps={{
                sx: {
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '0.875rem'
                }
              }}
            />

            <FormControl variant="outlined" size="small" required sx={{ flex: 1 }}>
              <InputLabel id="cargo-label" sx={{ fontSize: '0.875rem' }}>Cargo</InputLabel>              <Select
                labelId="cargo-label"
                label="Cargo"
                defaultValue=""
                sx={{ 
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              >
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Técnico">Técnico</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Segunda linha: Email ocupando toda a largura */}
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            variant="outlined"
            size="small"
            required
            InputProps={{
              sx: {
                borderRadius: '6px',
                fontSize: '0.875rem'
              }
            }}
            InputLabelProps={{
              sx: {
                fontSize: '0.875rem'
              }
            }}
          />

          {/* Terceira linha: Senha e Confirmar senha lado a lado */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              size="small"
              required
              sx={{ flex: 1 }}
              InputProps={{
                sx: {
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '0.875rem'
                }
              }}
            />

            <TextField
              label="Confirmar senha"
              type="password"
              variant="outlined"
              size="small"
              required
              sx={{ flex: 1 }}
              InputProps={{
                sx: {
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '0.875rem'
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>      <DialogActions sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'center',
        gap: 2
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size="medium"
          sx={{ 
            textTransform: 'none',
            borderRadius: '6px',
            color: '#666',
            borderColor: '#d1d1d1',
            fontSize: '0.875rem',
            minWidth: '120px',
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
          size="medium"
          sx={{ 
            textTransform: 'none',
            bgcolor: '#61131A', 
            '&:hover': { bgcolor: '#4e0f15' },
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: '180px',
            py: 1
          }}
        >
          Criar Usuário
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;
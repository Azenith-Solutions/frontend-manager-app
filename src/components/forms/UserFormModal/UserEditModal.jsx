import React, { useState, useEffect } from 'react';
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
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { api } from '../../../provider/apiProvider';

const UserEditModal = ({ open, onClose, user, onUserUpdated }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });  // Carregar dados do usuário quando o modal for aberto
  useEffect(() => {
    if (open && user) {
      setFormData({
        fullName: user.nome || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        status: user.status === 'Ativo'
      });
      
      // Se tivermos os dados brutos, podemos usá-los diretamente
      if (user.rawData) {
        console.log('Usando dados brutos do usuário:', user.rawData);
      }
      
      // Buscar os cargos se ainda não foram carregados
      if (roles.length === 0) {
        fetchRoles();
      } else {
        // Encontrar o cargo correto baseado no nome
        const userRole = roles.find(role => role.funcao === user.cargo);
        if (userRole) {
          setSelectedRole(userRole.id);
        }
      }
    }
  }, [open, user]);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função para lidar com mudança no status (ativo/inativo)
  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: e.target.checked
    });
  };

  // Função para carregar os cargos da API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/roles');
      
      if (response.data && Array.isArray(response.data.data)) {
        setRoles(response.data.data);
        
        // Se o usuário tiver um cargo, selecioná-lo
        if (user && user.cargo) {
          const userRole = response.data.data.find(role => role.funcao === user.cargo);
          if (userRole) {
            setSelectedRole(userRole.id);
          }
        }
      } else {
        console.error('Formato de resposta inesperado para cargos:', response);
        setRoles([]);
      }
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar cargos:', error);
      setRoles([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
      // Validações do lado do cliente
    if (!formData.fullName || !formData.email || !selectedRole) {
      setSnackbar({
        open: true,
        message: 'Por favor, preencha todos os campos obrigatórios',
        severity: 'error'
      });
      return;
    }

    // Validação do nome (apenas letras e espaços)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.fullName)) {
      setSnackbar({
        open: true,
        message: 'O nome completo deve conter apenas letras e espaços',
        severity: 'error'
      });
      return;
    }

    // Validação do email
    const emailRegex = /.*@.*\..*/;
    if (!emailRegex.test(formData.email)) {
      setSnackbar({
        open: true,
        message: 'O email deve conter @ e um domínio válido',
        severity: 'error'
      });
      return;
    }
      // Validação das senhas, se fornecidas
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setSnackbar({
          open: true,
          message: 'As senhas não coincidem',
          severity: 'error'
        });
        return;
      }
      
      // Validação da senha (8+ caracteres, letras maiúsculas, minúsculas, números e caracteres especiais)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}:;"'<>,.?~`-])[A-Za-z\d!@#$%^&*()_+={}:;"'<>,.?~`-]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setSnackbar({
          open: true,
          message: 'A senha deve conter pelo menos 8 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial',
          severity: 'error'
        });
        return;
      }
    }

    try {
      setLoading(true);
        const userData = {
        fullName: formData.fullName,
        email: formData.email,
        role: selectedRole,
        status: formData.status
      };
      
      // Adicionar senha apenas se foi fornecida
      if (formData.password) {
        userData.password = formData.password;
      }console.log('Enviando dados para atualização:', userData);
      
      // Endpoint de atualização de usuário
      const response = await api.put(`/users/${user.id}`, userData);
      
      console.log('Resposta da atualização:', response.data);
      
      // Indica que a atualização foi bem-sucedida
      setUpdateSuccess(true);
      
      // Exibe mensagem de sucesso
      setSnackbar({
        open: true,
        message: 'Usuário atualizado com sucesso!',
        severity: 'success'
      });
        // Simula um processo de finalização/sincronização
      setTimeout(() => {
        // Fecha o modal após 3 segundos, permitindo que o usuário veja a mensagem
        setTimeout(() => {
          setUpdateSuccess(false);
          setLoading(false);
          
          // Chama o callback para atualizar a tabela principal
          if (onUserUpdated) {
            onUserUpdated();
          }
          
          onClose();
        }, 1000);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      let errorMessage = 'Erro ao atualizar usuário. Tente novamente.';
      
      // Tratamento de diferentes tipos de erros
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          // Verificar se é erro de validação com mensagens específicas
          if (data.message === "Validation Error" && Array.isArray(data.data) && data.data.length > 0) {
            // Formatar as mensagens de validação para exibição
            errorMessage = data.data.join('\n');
          } else if (Array.isArray(data.data)) {
            errorMessage = data.data.join(', ');
          } else {
            errorMessage = 'Dados inválidos. Verifique os campos.';
          }
        } else if (status === 409) {
          errorMessage = 'Este e-mail já está em uso por outro usuário.';
        } else if (data.message) {
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
      }}>        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            sx={{ 
              backgroundColor: '#61131A', // Cor da marca para consistência visual
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center', 
              justifyContent: 'center'
            }}
          >
            <EditIcon sx={{ color: 'white', fontSize: '18px' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#333' }}>
            Editar Usuário
          </Typography>
        </Box>
        <IconButton 
          edge="end" 
          onClick={onClose} 
          aria-label="close"
          sx={{            color: '#666',
            '&:hover': { 
              backgroundColor: 'rgba(0,0,0,0.05)', 
              color: '#61131A' 
            } 
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, position: 'relative' }}>
        {/* Overlay de sucesso */}
        {updateSuccess && (
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
              gap: 2,
              borderRadius: '4px'
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                fontSize: 60, 
                color: '#2e7d32',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)', opacity: 0.8 },
                  '70%': { transform: 'scale(1.1)', opacity: 1 },
                  '100%': { transform: 'scale(0.95)', opacity: 0.8 }
                }
              }} 
            />
            <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
              Usuário atualizado com sucesso!
            </Typography>            <Typography variant="body2" color="text.secondary">
              Atualizando informações...
            </Typography>
            <CircularProgress size={24} sx={{ mt: 1, color: '#61131A' }} />
          </Box>
        )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Edite as informações do usuário nos campos abaixo. Para alterar a senha, preencha os campos de senha.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              autoFocus
              label="Nome completo"
              variant="outlined"
              size="small"
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              helperText="Apenas letras e espaços são permitidos"
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
              FormHelperTextProps={{
                sx: { fontSize: '0.7rem' }
              }}
            />
            
            <FormControl variant="outlined" size="small" required sx={{ flex: 1 }}>
              <InputLabel id="cargo-label" sx={{ fontSize: '0.875rem' }}>Cargo</InputLabel>
              <Select
                labelId="cargo-label"
                label="Cargo"
                value={selectedRole}
                onChange={handleRoleChange}
                sx={{ 
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              >
                {loading ? (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography>Carregando...</Typography>
                    </Box>
                  </MenuItem>
                ) : (
                  roles.length > 0 ? (
                    roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.funcao}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Nenhum cargo disponível</MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="E-mail"
            type="email"
            fullWidth
            variant="outlined"
            size="small"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            helperText="Formato: exemplo@dominio.com"
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
            FormHelperTextProps={{
              sx: { fontSize: '0.7rem' }
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField              label="Nova senha"
              type="password"
              fullWidth
              variant="outlined"
              size="small"
              name="password"
              value={formData.password}
              onChange={handleChange}
              helperText="Deixe em branco para manter a senha atual. Nova senha deve ter 8+ caracteres, maiúscula, minúscula, número e caractere especial."
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
              FormHelperTextProps={{
                sx: { fontSize: '0.7rem' }
              }}
            />
            
            <TextField              label="Confirmar senha"
              type="password"
              fullWidth
              variant="outlined"
              size="small"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' 
                ? "As senhas não coincidem" 
                : "Confirme a nova senha"}
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
              FormHelperTextProps={{
                sx: { 
                  fontSize: '0.7rem',
                  color: formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'error.main' : 'text.secondary'
                }
              }}
              error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch 
                checked={formData.status}
                onChange={handleStatusChange}
                color="success"
              />
            }
            label={
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">
                  Status: {formData.status ? 'Ativo' : 'Inativo'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Desative para bloquear o acesso do usuário ao sistema
                </Typography>
              </Box>
            }
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
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
          disabled={loading || updateSuccess}
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
          type="button"
          onClick={handleSubmit}          disabled={loading || updateSuccess}
          sx={{ 
            textTransform: 'none',
            bgcolor: updateSuccess ? '#2e7d32' : '#61131A', 
            '&:hover': { bgcolor: updateSuccess ? '#2e7d32' : '#4e0f15' },
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: '180px',
            py: 1,
            position: 'relative',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
              <span style={{ visibility: 'hidden' }}>Atualizar Usuário</span>
            </>
          ) : updateSuccess ? (
            <>
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              Usuário Atualizado
            </>
          ) : (
            'Atualizar Usuário'
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

export default UserEditModal;

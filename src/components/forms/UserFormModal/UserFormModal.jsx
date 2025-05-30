import React, { useState, useEffect, useRef } from 'react';
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
  Avatar,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
// Import all icons from the package instead of individual imports
import * as Icons from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { api } from '../../../provider/apiProvider';

const UserFormModal = ({ open, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função para lidar com a seleção de imagem
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Formato de imagem inválido. Use JPG, PNG ou GIF.',
          severity: 'error'
        });
        return;
      }

      // Verificar tamanho do arquivo (limite de 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'A imagem deve ter no máximo 2MB.',
          severity: 'error'
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover a imagem selecionada
  const handleImageRemove = (e) => {
    e.stopPropagation(); // Evita trigger do input file
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para acionar o input de arquivo quando clicar no avatar
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Limpar a imagem quando o modal é fechado ou resetado
  useEffect(() => {
    if (!open) {
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  // Função para carregar os cargos da API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/roles');
      console.log('Resposta da API de cargos:', response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setRoles(response.data.data);
      } else {
        console.error('Formato de resposta inesperado para cargos:', response);
        setRoles([]);
      }
    } catch (error) {
      console.error('Erro ao buscar cargos:', error);
      setRoles([]);
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
    if (!formData.fullName || !formData.email || !formData.password || !selectedRole) {
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

    if (formData.password !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'As senhas não coincidem',
        severity: 'error'
      });
      return;
    } try {
      setLoading(true);

      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: selectedRole
      };
      console.log('Enviando dados (objeto):', userData);

      const formDataToSend = new FormData();
      // Create a Blob from the JSON string with the correct MIME type
      const jsonDataBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
      // Append the Blob as 'data', providing a filename can also be helpful
      formDataToSend.append('data', jsonDataBlob, 'data.json');

      // Se houver imagem selecionada, adiciona ao FormData
      if (imageFile) {
        formDataToSend.append('file', imageFile);
      }

      console.log('Enviando FormData:', formDataToSend);

      // Removido o terceiro argumento (objeto de configuração) para permitir que o Axios
      // e o interceptor gerenciem o Content-Type para FormData automaticamente.
      const response = await api.post('/auth/register', formDataToSend);

      console.log('Resposta do cadastro:', response.data);

      // Indica que o registro foi bem-sucedido
      setRegistrationSuccess(true);

      // Exibe mensagem de sucesso
      setSnackbar({
        open: true,
        message: 'Usuário cadastrado com sucesso!',
        severity: 'success'
      });

      // Simula um processo de finalização/sincronização
      // O modal permanecerá aberto por mais tempo, exibindo um estado de carregamento
      setTimeout(() => {
        // Limpa o formulário
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setSelectedRole('');
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Fecha o modal após 3 segundos, permitindo que o usuário veja a mensagem
        setTimeout(() => {
          setRegistrationSuccess(false);
          setLoading(false);
          onClose();
        }, 1000);
      }, 2000);

    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);

      let errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';

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
          errorMessage = 'Este e-mail já está cadastrado.';
        } else if (data.message) {
          errorMessage = data.message;
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
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
      </DialogTitle>      <DialogContent sx={{ p: 3, position: 'relative' }}>
        {/* Overlay de sucesso */}
        {registrationSuccess && (
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
              Usuário cadastrado com sucesso!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Atualizando informações...
            </Typography>
            <CircularProgress size={24} sx={{ mt: 1, color: '#61131A' }} />
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Preencha os campos abaixo para criar um novo usuário no sistema. Todos os campos são obrigatórios.
        </Typography>

        {/* Componente de Upload de Imagem */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              position: 'relative',
              width: '120px',
              height: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Avatar com Preview ou Placeholder */}
            <Avatar
              src={imagePreview}
              alt="Preview do avatar"
              onClick={triggerFileInput}
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: imagePreview ? 'transparent' : '#f5f5f5',
                border: '3px solid #f1f1f1',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              {imagePreview ? null : (
                <Tooltip title="Adicionar foto de perfil">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Icons.AddAPhoto sx={{ fontSize: 32, color: '#61131A', mb: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                      Adicionar foto
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Avatar>

            {/* Input file oculto */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/jpeg, image/png, image/jpg, image/gif"
              style={{ display: 'none' }}
            />

            {/* Botão de Remover Imagem */}
            {imagePreview && (
              <IconButton
                size="small"
                onClick={handleImageRemove}
                sx={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  padding: '5px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <DeleteIcon fontSize="small" sx={{ color: '#61131A' }} />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>            <TextField
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
          /><FormControl variant="outlined" size="small" required sx={{ flex: 1 }}>
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
              >                {loading ? (
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

          {/* Segunda linha: Email ocupando toda a largura */}          <TextField
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

          {/* Terceira linha: Senha e Confirmar senha lado a lado */}
          <Box sx={{ display: 'flex', gap: 2 }}>            <TextField
            label="Senha"
            type="password"
            variant="outlined"
            size="small"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
            helperText="Mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial"
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

            <TextField label="Confirmar senha"
              type="password"
              variant="outlined"
              size="small"
              required
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              helperText="Digite a mesma senha novamente"
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
          </Box>
        </Box>
      </DialogContent>      <DialogActions sx={{
        p: 2,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'center',
        gap: 2
      }}>        <Button
        onClick={onClose}
        variant="outlined"
        size="medium"
        disabled={loading || registrationSuccess}
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
          onClick={handleSubmit}
          disabled={loading || registrationSuccess}
          sx={{
            textTransform: 'none',
            bgcolor: registrationSuccess ? '#2e7d32' : '#61131A',
            '&:hover': { bgcolor: registrationSuccess ? '#2e7d32' : '#4e0f15' },
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
              <span style={{ visibility: 'hidden' }}>Criar Usuário</span>
            </>
          ) : registrationSuccess ? (
            <>
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              Usuário Criado
            </>
          ) : (
            'Criar Usuário'
          )}
        </Button>
      </DialogActions>      {/* Snackbar para mensagens de sucesso/erro */}
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

export default UserFormModal;
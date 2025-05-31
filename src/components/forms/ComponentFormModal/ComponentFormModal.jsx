import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  FormHelperText,
  Divider,
  Alert,
  IconButton,
  Avatar,
  Tooltip
} from '@mui/material';
import { api } from '../../../service/api';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';

const ComponentFormModal = ({ open, onClose, componentToEdit = null, componentes = [] }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [caixas, setCaixas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const [formData, setFormData] = useState({
    idHardWareTech: '1801-',
    nomeComponente: '',  
    partNumber: '',
    descricao: '',
    quantidade: 1,
    fkCaixa: '',
    categoria: '',
    flagVerificado: 'Não',
    condicao: '',
    observacao: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState('');

  const defaultImage = "https://cdn.awsli.com.br/500x500/2599/2599375/produto/21644533946530777e3.jpg";

  const [errors, setErrors] = useState({});

  // Busca as caixas e categorias para os dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const caixasResponse = await api.get('/boxes');

        let caixasData = caixasResponse.data;
        if (caixasData && caixasData.data) caixasData = caixasData.data;
        if (!Array.isArray(caixasData)) caixasData = [];

        const caixasNormalizadas = caixasData.map(caixa => ({
          idCaixa: caixa.idCaixa ?? caixa.id ?? caixa.value ?? '',
          nomeCaixa: caixa.nomeCaixa ?? caixa.caixa ?? caixa.nome ?? caixa.label ?? ''
        }));

        setCaixas(caixasNormalizadas);

        const categoriasResponse = await api.get('/categorys');

        let categoriasData = categoriasResponse.data;
        if (categoriasData && categoriasData.data) categoriasData = categoriasData.data;
        if (!Array.isArray(categoriasData)) categoriasData = [];

        const categoriasNormalizadas = categoriasData.map(categoria => ({
          idCategoria: categoria.idCategoria ?? categoria.id ?? categoria.value ?? '',
          nomeCategoria: categoria.nomeCategoria ?? categoria.categoria ?? categoria.nome ?? categoria.label ?? ''
        }));

        setCategorias(categoriasNormalizadas);

      } catch (error) {
        console.error('Erro ao carregar dados para os dropdowns:', error);
        alert(
          `Erro ao buscar dados: ${error.message}\n` +
          (error.response ? `Status: ${error.response.status}\n${JSON.stringify(error.response.data)}` : '')
        );
        setError('Falha ao carregar informações necessárias. Por favor, tente novamente.');
      } finally {
        setLoadingDropdowns(false);
      }
    };

    if (open) {
      fetchDropdownData();
    }
  }, [open]);

  // Se for edição, carrega os dados do componente
  useEffect(() => {
    if (componentToEdit) {
      setFormData({
        idHardWareTech: componentToEdit.idHardWareTech || '',
        nomeComponente: componentToEdit.nomeComponente || '',  
        partNumber: componentToEdit.partNumber || '',
        descricao: componentToEdit.descricao || '',
        quantidade: componentToEdit.quantidade || 1,
        fkCaixa:
          componentToEdit.fkCaixa?.idCaixa ||
          componentToEdit.caixa?.idCaixa ||
          componentToEdit.caixa ||
          '',
        categoria:
          componentToEdit.fkCategoria?.idCategoria ||
          componentToEdit.fkCategoria?.id ||
          componentToEdit.fkCategoria ||
          componentToEdit.categoria?.idCategoria ||
          componentToEdit.categoria?.id ||
          componentToEdit.categoria ||
          '',
        flagVerificado: componentToEdit.flagVerificado ? 'Sim' : 'Não',
        condicao: componentToEdit.condicao || '',
        observacao: componentToEdit.observacao || ''
      });

      if (componentToEdit.imagemUrl) {
        setPreviewImage(componentToEdit.imagemUrl);
      } else {
        setPreviewImage(defaultImage);
      }
    }
  }, [componentToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    if (name === 'flagVerificado' && value === 'Não') {
      setFormData(prev => ({
        ...prev,
        condicao: '',
        observacao: ''
      }));
    }

    if (name === 'condicao' && value !== 'Em Observação') {
      setFormData(prev => ({
        ...prev,
        observacao: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');

    if (!file) {
      return;
    }

    // Validação do tipo de arquivo
    if (!file.type.match('image.*')) {
      setImageError('O arquivo deve ser uma imagem (JPEG, PNG, etc.)');
      return;
    }

    // Validação do tamanho do arquivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setImageError('A imagem deve ter no máximo 2MB');
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idHardWareTech) {
      newErrors.idHardWareTech = 'O IDH é obrigatório';
    }
    
    if (!formData.nomeComponente) {
      newErrors.nomeComponente = 'O nome do componente é obrigatório';
    }
    
    if (!formData.partNumber) {
      newErrors.partNumber = 'O Part Number é obrigatório';
    }

    if (formData.quantidade < 1) {
      newErrors.quantidade = 'A quantidade deve ser pelo menos 1';
    }

    if (!formData.fkCaixa) {
      newErrors.fkCaixa = 'Selecione uma caixa';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Selecione uma categoria';
    }

    if (formData.flagVerificado === 'Sim' && !formData.condicao) {
      newErrors.condicao = 'Selecione a condição do componente';
    }

    if (formData.condicao === 'EM_OBSERVACAO' && !formData.observacao) {
      newErrors.observacao = 'Insira uma observação sobre o componente';
    }
    
    // Validação obrigatória da imagem (apenas para novos componentes)
    if (!componentToEdit && !selectedImage) {
      newErrors.imagem = 'A imagem do componente é obrigatória';
      setImageError('A imagem do componente é obrigatória');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkDuplicateIDH = (idh) => {
    // Verifica primeiro no array de componentes recebido como prop
    if (componentes && componentes.length > 0) {
      // Itera sobre todos os componentes existentes
      const isDuplicate = componentes.some(comp => {
        // Se estamos editando, só é duplicado se o IDH for igual a outro componente que não seja o atual
        if (componentToEdit) {
          return comp.idHardWareTech === idh && comp.idComponente !== componentToEdit.idComponente;
        }
        // Se estamos criando, qualquer IDH igual é duplicado
        return comp.idHardWareTech === idh;
      });
      
      if (isDuplicate) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isDuplicate = checkDuplicateIDH(formData.idHardWareTech);
    if (isDuplicate) {
      setError(`Já existe um componente com o IDH "${formData.idHardWareTech}" no estoque.`);
      setErrors(prev => ({
        ...prev,
        idHardWareTech: `Este IDH já está sendo usado por outro componente`
      }));
      return; 
    }

    setSubmitting(true);
    setError(null);

    try {
      const componentData = {
        idHardWareTech: formData.idHardWareTech,
        nomeComponente: formData.nomeComponente,
        fkCaixa: Number(formData.fkCaixa),
        fkCategoria: Number(formData.categoria),
        partNumber: formData.partNumber,
        quantidade: Number(formData.quantidade),
        flagML: false, 
        codigoML: "",  
        flagVerificado: formData.flagVerificado === 'Sim',
        condicao: formData.flagVerificado === 'Sim' ? formData.condicao : null,
        observacao: formData.condicao === 'EM_OBSERVACAO' ? formData.observacao : "",
        descricao: formData.descricao,
        isVisibleCatalog: false
      };

      let responseData;

      const formDataToSend = new FormData();
      
      const jsonDataBlob = new Blob([JSON.stringify(componentData)], { type: 'application/json' });
      formDataToSend.append('data', jsonDataBlob, 'data.json');

      if (selectedImage) {
        formDataToSend.append('file', selectedImage);
      }
      
      if (componentToEdit && componentToEdit.idComponente) {
        console.log('Atualizando componente:', componentToEdit.idComponente);
        console.log('Dados enviados:', componentData);
        
        const response = await api.put(`/components/${componentToEdit.idComponente}`, formDataToSend);
        
        responseData = response.data;
        
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        console.log('Cadastrando novo componente com FormData');
        
        try {
          const response = await api.post('/components', formDataToSend);
          
          responseData = response.data;
          
          setSuccess(true);
          setTimeout(() => {
            handleClose();
          }, 1500);
        } catch (err) {
          console.error('Erro ao cadastrar:', err);
          
          // Fiz para debuggar erro de permisão
          if (err.response && err.response.status === 403) {
            setError('Acesso negado. Você não tem permissão para realizar esta operação.');
          }
          else if (err.response && err.response.data) {
            if (err.response.data.message && err.response.data.message.includes("já existe")) {
              setError(`Já existe um componente com o IDH "${formData.idHardWareTech}" no estoque.`);
              setErrors(prev => ({
                ...prev,
                idHardWareTech: `Este IDH já está sendo usado por outro componente`
              }));
            } else if (err.response.status === 409) {
              setError(`Já existe um componente com o IDH "${formData.idHardWareTech}" no estoque.`);
              setErrors(prev => ({
                ...prev,
                idHardWareTech: `Este IDH já está sendo usado por outro componente`
              }));
            } else {
              setError(err.response.data.message || 'Erro ao cadastrar componente. Tente novamente.');
            }
          } else {
            setError('Erro ao cadastrar componente. Tente novamente.');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar componente:', error);
      
      // Verifica se é um erro de autorização
      if (error.response && error.response.status === 403) {
        setError('Acesso negado. Você não tem permissão para realizar esta operação.');
      } else {
        const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Ocorreu um erro ao salvar o componente. Tente novamente.';
        setError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      idHardWareTech: '',
      nomeComponente: '',  
      partNumber: '',
      descricao: '',
      quantidade: 1,
      fkCaixa: '',
      categoria: '',
      flagVerificado: 'Não',
      condicao: '',
      observacao: ''
    });
    setErrors({});
    setSuccess(false);
    setError(null);
    setSelectedImage(null);
    setPreviewImage(null);
    setImageError('');
    onClose();
  };

  const triggerFileInput = () => {
    document.getElementById('component-image-upload').click();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        elevation: 3,
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
            <InventoryIcon sx={{ color: 'white', fontSize: '18px' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#333' }}>
            {componentToEdit ? 'Editar Componente' : 'Novo Componente'}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          onClick={handleClose}
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

      <DialogContent sx={{ pt: 3, pb: 1, position: 'relative' }}>
        {/* Overlay de sucesso */}
        {success && (
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
              Componente {componentToEdit ? 'atualizado' : 'cadastrado'} com sucesso!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Atualizando informações...
            </Typography>
            <CircularProgress size={24} sx={{ mt: 1, color: '#61131A' }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {componentToEdit 
            ? 'Edite as informações do componente nos campos abaixo.' 
            : 'Preencha os campos abaixo para cadastrar um novo componente no sistema.'}
        </Typography>

        {loadingDropdowns ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', py: 4 }}>
            <CircularProgress size={40} sx={{ color: '#61131A' }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Área de upload de imagem (lado esquerdo) */}
            <Box sx={{
              width: { xs: '100%', md: '200px' }, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2
            }}>
              <Box sx={{
                width: '160px', 
                height: '160px', 
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                border: `2px dashed ${imageError ? '#d32f2f' : '#61131A'}`,
                backgroundColor: '#f9f9f9',
                mb: 2,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }} onClick={triggerFileInput}>
                {/* Preview da imagem */}
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview do componente"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Tooltip title="Adicionar imagem do componente">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <CloudUploadIcon sx={{ fontSize: 42, color: '#61131A', mb: 1 }} />
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem', textAlign: 'center' }}>
                        {componentToEdit ? 'Trocar imagem' : 'Adicionar imagem *'}
                      </Typography>
                    </Box>
                  </Tooltip>
                )}

                {/* Botão de upload sobreposto à imagem */}
                {previewImage && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'rgba(97, 19, 26, 0.9)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(97, 19, 26, 0.7)'
                      },
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Input oculto para upload de arquivo */}
              <input
                id="component-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {imageError && (
                <Typography color="error" variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                  {imageError}
                </Typography>
              )}

              <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: '#666' }}>
                {!componentToEdit && <span style={{ color: '#d32f2f' }}>* Obrigatório</span>}
                <br />
                Tamanho máximo: 2MB
                <br />
                Formatos: JPEG, PNG
              </Typography>
            </Box>

            {/* Formulário (lado direito) */}
            <Box sx={{ flex: 1, p: { xs: 1, md: 2 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <TextField
                    label="ID HardWare Tech"
                    variant="outlined"
                    name="idHardWareTech"
                    value={formData.idHardWareTech}
                    onChange={handleChange}
                    error={Boolean(errors.idHardWareTech)}
                    helperText={errors.idHardWareTech}
                    disabled={submitting}
                    size="small"
                    sx={{ flex: '1 1 45%', minWidth: '200px' }}
                  />

                  <TextField
                    label="Nome do Componente"
                    variant="outlined"
                    name="nomeComponente"
                    value={formData.nomeComponente}
                    onChange={handleChange}
                    error={Boolean(errors.nomeComponente)}
                    helperText={errors.nomeComponente}
                    disabled={submitting}
                    size="small"
                    sx={{ flex: '1 1 45%', minWidth: '200px' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <TextField
                    label="Part Number"
                    variant="outlined"
                    name="partNumber"
                    value={formData.partNumber}
                    onChange={handleChange}
                    error={Boolean(errors.partNumber)}
                    helperText={errors.partNumber}
                    disabled={submitting}
                    size="small"
                    sx={{ flex: '1 1 45%', minWidth: '200px' }}
                  />

                  <TextField
                    label="Quantidade"
                    variant="outlined"
                    name="quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={handleChange}
                    error={Boolean(errors.quantidade)}
                    helperText={errors.quantidade}
                    disabled={submitting}
                    size="small"
                    sx={{ flex: '1 1 45%', minWidth: '120px' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <FormControl 
                    variant="outlined" 
                    disabled={submitting} 
                    size="small"
                    error={Boolean(errors.fkCaixa)}
                    sx={{ flex: '1 1 45%', minWidth: '200px' }}
                  >
                    <InputLabel id="select-caixa-label">Caixa</InputLabel>
                    <Select
                      labelId="select-caixa-label"
                      id="select-caixa"
                      name="fkCaixa"
                      value={formData.fkCaixa}
                      onChange={handleChange}
                      label="Caixa"
                    >
                      {caixas.map(caixa => (
                        <MenuItem key={caixa.idCaixa} value={caixa.idCaixa}>
                          {caixa.nomeCaixa}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.fkCaixa}</FormHelperText>
                  </FormControl>

                  <FormControl 
                    variant="outlined" 
                    disabled={submitting} 
                    size="small"
                    error={Boolean(errors.categoria)}
                    sx={{ flex: '1 1 45%', minWidth: '200px' }}
                  >
                    <InputLabel id="select-categoria-label">Categoria</InputLabel>
                    <Select
                      labelId="select-categoria-label"
                      id="select-categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      label="Categoria"
                    >
                      {categorias.map(categoria => (
                        <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                          {categoria.nomeCategoria}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.categoria}</FormHelperText>
                  </FormControl>
                </Box>

                <TextField
                  label="Descrição"
                  variant="outlined"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  error={Boolean(errors.descricao)}
                  helperText={errors.descricao}
                  disabled={submitting}
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                />

                <FormControl 
                  variant="outlined" 
                  disabled={submitting} 
                  size="small"
                  fullWidth
                >
                  <InputLabel id="select-flagVerificado-label">Verificado</InputLabel>
                  <Select
                    labelId="select-flagVerificado-label"
                    id="select-flagVerificado"
                    name="flagVerificado"
                    value={formData.flagVerificado}
                    onChange={handleChange}
                    error={Boolean(errors.flagVerificado)}
                    label="Verificado"
                  >
                    <MenuItem value="Sim">Sim</MenuItem>
                    <MenuItem value="Não">Não</MenuItem>
                  </Select>
                </FormControl>

                {formData.flagVerificado === 'Sim' && (
                  <FormControl
                    variant="outlined"
                    disabled={submitting}
                    size="small"
                    error={!!errors.condicao}
                    fullWidth
                  >
                    <InputLabel id="select-condicao-label">Condição</InputLabel>
                    <Select
                      labelId="select-condicao-label"
                      id="select-condicao"
                      name="condicao"
                      value={formData.condicao}
                      onChange={handleChange}
                      label="Condição"
                    >
                      <MenuItem value="BOM_ESTADO">Bom Estado</MenuItem>
                      <MenuItem value="EM_OBSERVACAO">Em Observação</MenuItem>
                    </Select>
                    <FormHelperText>{errors.condicao}</FormHelperText>
                  </FormControl>
                )}

                {formData.condicao === 'EM_OBSERVACAO' && (
                  <TextField
                    label="Observação"
                    variant="outlined"
                    name="observacao"
                    value={formData.observacao}
                    onChange={handleChange}
                    error={Boolean(errors.observacao)}
                    helperText={errors.observacao}
                    disabled={submitting}
                    size="small"
                    multiline
                    rows={2}
                    fullWidth
                  />
                )}
              </Box>
            </Box>
          </Box>
        )}
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
          onClick={handleClose} 
          variant="outlined"
          size="medium"
          disabled={submitting || success}
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
          onClick={handleSubmit}
          variant="contained"
          disableElevation
          size="medium"
          disabled={submitting || success}
          sx={{
            textTransform: 'none',
            bgcolor: success ? '#2e7d32' : '#61131A',
            '&:hover': { bgcolor: success ? '#2e7d32' : '#4e0f15' },
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: '180px',
            py: 1,
            position: 'relative',
            transition: 'background-color 0.3s'
          }}
        >
          {submitting ? (
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
              <span style={{ visibility: 'hidden' }}>
                {componentToEdit ? 'Atualizar Componente' : 'Cadastrar Componente'}
              </span>
            </>
          ) : success ? (
            <>
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              {componentToEdit ? 'Componente Atualizado' : 'Componente Cadastrado'}
            </>
          ) : (
            componentToEdit ? 'Atualizar Componente' : 'Cadastrar Componente'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComponentFormModal;

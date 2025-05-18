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
  Avatar
} from '@mui/material';
import { api } from '../../../provider/apiProvider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ComponentFormModal = ({ open, onClose, componentToEdit = null }) => {
  // Estados iniciais
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para armazenar dados de dropdowns
  const [caixas, setCaixas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Estado do formulário
  const [formData, setFormData] = useState({
    idHardWareTech: '',
    partNumber: '',
    descricao: '',
    quantidade: 1,
    fkCaixa: '',
    categoria: '',
    flagVerificado: 'Não',
    condicao: '',
    observacao: ''
  });

  // Estados para gerenciamento da imagem
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState('');
  
  // Imagem padrão para componentes sem foto
  const defaultImage = "https://cdn.awsli.com.br/500x500/2599/2599375/produto/21644533946530777e3.jpg";

  // Erros de validação
  const [errors, setErrors] = useState({});

  // Busca as caixas e categorias para os dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        // Buscar caixas
        const caixasResponse = await api.get('/boxes');
        // Ajuste: garantir que o retorno seja sempre um array de objetos com idCaixa e nomeCaixa
        let caixasData = caixasResponse.data;
        if (caixasData && caixasData.data) caixasData = caixasData.data;
        if (!Array.isArray(caixasData)) caixasData = [];
        // Log para depuração
        console.log('Caixas recebidas:', caixasData);
        // Normalizar campos caso venham com nomes diferentes
        const caixasNormalizadas = caixasData.map(caixa => ({
          idCaixa: caixa.idCaixa ?? caixa.id ?? caixa.value ?? '',
          nomeCaixa: caixa.nomeCaixa ?? caixa.caixa ?? caixa.nome ?? caixa.label ?? ''
        }));
        setCaixas(caixasNormalizadas);

        // Buscar categorias
        const categoriasResponse = await api.get('/categorys');
        let categoriasData = categoriasResponse.data;
        if (categoriasData && categoriasData.data) categoriasData = categoriasData.data;
        if (!Array.isArray(categoriasData)) categoriasData = [];
        // Normalizar campos para categoria
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
      
      // Carregar imagem se existir
      if (componentToEdit.imagemUrl) {
        setPreviewImage(componentToEdit.imagemUrl);
      } else {
        setPreviewImage(defaultImage);
      }
    } else {
      setPreviewImage(defaultImage);
    }
  }, [componentToEdit, open]);

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erros quando o campo é preenchido
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Lógica condicional para campos dependentes
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

  // Função para lidar com o upload de imagem
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

    // Salvar a imagem selecionada
    setSelectedImage(file);
    
    // Criar URL para preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.idHardWareTech) {
      newErrors.idHardWareTech = 'O IDH é obrigatório';
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

    if (formData.condicao === 'Em Observação' && !formData.observacao) {
      newErrors.observacao = 'Insira uma observação sobre o componente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para salvar o componente
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      // Se houver imagem, faça upload antes (mantém sua lógica atual)
      let imageUrl = componentToEdit?.imagemUrl || null;
      if (selectedImage) {
        const formDataImage = new FormData();
        formDataImage.append('imagem', selectedImage);
        const uploadResponse = await api.post('/upload/component-image', formDataImage);
        if (uploadResponse.data && uploadResponse.data.url) {
          imageUrl = uploadResponse.data.url;
        }
      }

      const dataToSend = {
        idHardWareTech: formData.idHardWareTech,
        caixa: Number(formData.fkCaixa),
        categoria: Number(formData.categoria),
        partNumber: formData.partNumber,
        quantidade: Number(formData.quantidade),
        flagML: false, // ajuste conforme necessário
        codigoML: "",  // ajuste conforme necessário
        flagVerificado: formData.flagVerificado === 'Sim',
        condicao: formData.flagVerificado === 'Sim' ? formData.condicao : "",
        observacao: formData.condicao === 'Em Observação' ? formData.observacao : "",
        descricao: formData.descricao
      };

      if (componentToEdit && componentToEdit.idComponente) {
        console.log('componentToEdit:', componentToEdit);
        console.log('dataToSend:', dataToSend);
        await api.put(`/components/${componentToEdit.idComponente}`, dataToSend);
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1500);
        return; // Impede que o fluxo continue para o cadastro
      } else if (!componentToEdit || !componentToEdit?.idComponente) {
        // Apenas cadastra se for cadastro
        await api.post('/components', dataToSend);
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1500);
      }

    } catch (error) {
      console.error('Erro ao salvar componente:', error);
      setError(error.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Função para fechar o modal e limpar estados
  const handleClose = () => {
    setFormData({
      idHardWareTech: '',
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

  // Acionar input de arquivo oculto
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
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 700,
        color: '#333',
        borderBottom: '1px solid #eee',
        bgcolor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {componentToEdit ? 'Editar Componente' : 'Adicionar Novo Componente'}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 1, display: 'flex', flexDirection: 'row', height: 'auto' }}>
        {/* Feedback de sucesso e erro */}
        {success && (
          <Alert severity="success" sx={{ mb: 2, width: '100%', position: 'absolute', top: '70px', left: 0, zIndex: 1 }}>
            Componente {componentToEdit ? 'atualizado' : 'cadastrado'} com sucesso!
          </Alert>
        )}
        
        {loadingDropdowns ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', py: 4 }}>
            <CircularProgress size={40} sx={{ color: '#61131A' }} />
          </Box>
        ) : (
          <>
            {/* Área de upload de imagem (lado esquerdo) */}
            <Box sx={{ 
              width: '230px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              p: 2,
              borderRight: '1px solid #eee'
            }}>
              <Box sx={{ 
                width: '100%',
                pb: '100%', // Proporção 1:1
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                border: '1px dashed #ccc',
                backgroundColor: '#f9f9f9',
                mb: 2
              }}>
                {/* Preview da imagem */}
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview do componente"
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                )}
                
                {/* Botão de upload sobreposto à imagem */}
                <IconButton 
                  onClick={triggerFileInput}
                  disabled={submitting}
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
                  <PhotoCameraIcon />
                </IconButton>
              </Box>

              {/* Input oculto para upload de arquivo */}
              <input
                id="component-image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                disabled={submitting}
              />
              
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                onClick={triggerFileInput}
                disabled={submitting}
                sx={{ 
                  mt: 1,
                  color: '#61131A',
                  borderColor: '#61131A',
                  '&:hover': {
                    borderColor: '#4e0f15',
                    backgroundColor: 'rgba(97, 19, 26, 0.04)'
                  }
                }}
              >
                Escolher imagem
              </Button>
              
              {imageError && (
                <Typography color="error" variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
                  {imageError}
                </Typography>
              )}
              
              <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: '#666' }}>
                Tamanho máximo: 2MB
                <br />
                Formatos: JPEG, PNG
              </Typography>
            </Box>
            
            {/* Campos do formulário (lado direito) */}
            <Box sx={{ 
              flex: '1 1 auto', 
              ml: 3, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'auto',
              maxHeight: '70vh'
            }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* IDH */}
                <TextField
                  label="IDH (ID HardwareTech)"
                  name="idHardWareTech"
                  value={formData.idHardWareTech}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  error={!!errors.idHardWareTech}
                  helperText={errors.idHardWareTech}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#61131A',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#61131A',
                    }
                  }}
                />
                
                {/* Part Number */}
                <TextField
                  label="Part Number"
                  name="partNumber"
                  value={formData.partNumber}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  error={!!errors.partNumber}
                  helperText={errors.partNumber}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#61131A',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#61131A',
                    }
                  }}
                />
                
                {/* Descrição */}
                <TextField
                  label="Descrição"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#61131A',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#61131A',
                    }
                  }}
                />
                
                {/* Quantidade */}
                <TextField
                  label="Quantidade"
                  name="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  inputProps={{ min: 1 }}
                  error={!!errors.quantidade}
                  helperText={errors.quantidade}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#61131A',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#61131A',
                    }
                  }}
                />
                
                {/* Caixa */}
                <FormControl 
                  fullWidth 
                  size="small" 
                  required
                  error={!!errors.fkCaixa}
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#61131A',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#61131A',
                    }
                  }}
                >
                  <InputLabel>Caixa</InputLabel>
                  <Select
                    name="fkCaixa"
                    value={formData.fkCaixa}
                    label="Caixa"
                    onChange={handleChange}
                  >
                    {loadingDropdowns ? (
                      <MenuItem disabled>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} />
                          <Typography>Carregando...</Typography>
                        </Box>
                      </MenuItem>
                    ) : (
                      caixas.length > 0 ? (
                        caixas.map((caixa) => (
                          <MenuItem key={caixa.idCaixa} value={caixa.idCaixa}>
                            {caixa.nomeCaixa}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Nenhuma caixa disponível</MenuItem>
                      )
                    )}
                  </Select>
                  {errors.fkCaixa && <FormHelperText>{errors.fkCaixa}</FormHelperText>}
                </FormControl>
    
                {/* Categoria */}
                <FormControl 
                  fullWidth 
                  size="small" 
                  required
                  error={!!errors.categoria}
                  disabled={submitting || categorias.length === 0}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#61131A',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#61131A',
                    }
                  }}
                >
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    name="categoria"
                    value={formData.categoria}
                    label="Categoria"
                    onChange={handleChange}
                  >
                    {categorias.length > 0 ? (
                      categorias.map((categoria) => (
                        <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                          {categoria.nomeCategoria}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        Nenhuma categoria disponível
                      </MenuItem>
                    )}
                  </Select>
                  {errors.categoria && <FormHelperText>{errors.categoria}</FormHelperText>}
                </FormControl>
    
                {/* Status de verificação */}
                <FormControl 
                  fullWidth 
                  size="small" 
                  required
                  disabled={submitting}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#61131A',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#61131A',
                    }
                  }}
                >
                  <InputLabel>Verificado?</InputLabel>
                  <Select
                    name="flagVerificado"
                    value={formData.flagVerificado}
                    label="Verificado?"
                    onChange={handleChange}
                  >
                    <MenuItem value="Sim">Sim</MenuItem>
                    <MenuItem value="Não">Não</MenuItem>
                  </Select>
                </FormControl>
    
                {/* Condição (exibido apenas se verificado = Sim) */}
                {formData.flagVerificado === 'Sim' && (
                  <FormControl 
                    fullWidth 
                    size="small" 
                    required
                    error={!!errors.condicao}
                    disabled={submitting}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#61131A',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#61131A',
                      }
                    }}
                  >
                    <InputLabel>Condição</InputLabel>
                    <Select
                      name="condicao"
                      value={formData.condicao}
                      label="Condição"
                      onChange={handleChange}
                    >
                      <MenuItem value="Bom Estado">Bom Estado</MenuItem>
                      <MenuItem value="Em Observação">Em Observação</MenuItem>
                    </Select>
                    {errors.condicao && <FormHelperText>{errors.condicao}</FormHelperText>}
                  </FormControl>
                )}
    
                {/* Observação (exibido apenas se condição = Em Observação) */}
                {formData.condicao === 'Em Observação' && (
                  <TextField
                    label="Observação"
                    name="observacao"
                    value={formData.observacao}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    multiline
                    rows={2}
                    required
                    error={!!errors.observacao}
                    helperText={errors.observacao}
                    disabled={submitting}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#61131A',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#61131A',
                      }
                    }}
                  />
                )}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee', justifyContent: 'flex-end' }}>
        <Button 
          onClick={handleClose} 
          disabled={submitting}
          sx={{ 
            color: '#666',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || loadingDropdowns || success}
          sx={{
            bgcolor: '#61131A',
            '&:hover': { bgcolor: '#4e0f15' },
            '&.Mui-disabled': { 
              bgcolor: '#e0e0e0', 
              color: '#a0a0a0' 
            },
            textTransform: 'none',
            fontWeight: 600,
            px: 2
          }}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {submitting ? 'Salvando...' : componentToEdit ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComponentFormModal;

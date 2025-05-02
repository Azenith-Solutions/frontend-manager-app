import React, { useEffect, useState } from "react";
import styles from "./Gerenciamento.module.css";
import { api } from "../../provider/apiProvider";
import editarIcon from '../../assets/icons/editar.svg';
import lixeiraIcon from '../../assets/icons/lixeira.svg';

// Material UI Components
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination
} from "@mui/material";

// Material UI Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Gerenciamento = () => {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [stats] = useState({
    totalComponents: 1367,
    inStockComponents: 1240
  });

  // Mock data para tabela de exemplo
  const mockItems = [
    { 
      id: 1001,
      caixa: "Caixa A-15",
      partNumber: "DM74S28N",
      quantidade: 42,
      mercadoLivre: true,
      codigoML: "MLB2546871245",
      anunciado: true
    },
    { 
      id: 1002,
      caixa: "Caixa B-07",
      partNumber: "LM741CN",
      quantidade: 18,
      mercadoLivre: true,
      codigoML: "MLB1754269587",
      anunciado: true
    },
    { 
      id: 1003,
      caixa: "Caixa C-22",
      partNumber: "NE555P",
      quantidade: 64,
      mercadoLivre: false,
      codigoML: "-",
      anunciado: false
    }
  ];

  useEffect(() => {
    document.title = "HardwareTech | Gerenciamento";
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/components');
      console.log('Resposta dos componentes:', response);
      
      const responseData = response.data.data || response.data;
      
      if (Array.isArray(responseData)) {
        const formattedComponents = responseData.map((item) => ({
          id: item.idHardWareTech,
          caixa: item.caixa,
          partNumber: item.partNumber,
          quantidade: item.quantidade,
          flagML: item.flagML ? 'Sim' : 'Não',
          idMercadoLivre: item.codigoML || 'N/A',
          flagVerificado: item.flagVerificado ? 'Sim' : 'Não',
          condicao: item.condicao || 'N/A',
          observacao: item.verificado || '',
          descricao: item.descricao || 'Sem descrição'
        }));
        
        setComponents(formattedComponents);
      } else {
        console.error('Dados recebidos não são um array:', responseData);
        setComponents([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const filteredComponents = components.filter(
    (item) => 
      item.partNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toString().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dados do gerenciamento...
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.gerenciamento}>
      <Paper elevation={0} className={styles.toolbar}>
        <Box className={styles.searchBox}>
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <input 
            type="text" 
            placeholder="Buscar componente..."
            className={styles.searchInput}e
            onChange={handleSearchChange}
            value={searchText}
          />
        </Box>
        
        <Box className={styles.headerActions}>
          <IconButton size="small" title="Filtrar" className={styles.iconButton}>
            <FilterListIcon fontSize="small" />
          </IconButton>
          
          <IconButton size="small" title="Exportar" className={styles.iconButton}>
            <FileDownloadIcon fontSize="small" />
          </IconButton>
          
          <IconButton size="small" title="Importar" className={styles.iconButton}>
            <FileUploadIcon fontSize="small" />
          </IconButton>
          
          <Button 
            size="small" 
            variant="contained" 
            disableElevation
            startIcon={<AddIcon />}
            sx={{ 
              bgcolor: '#61131A', 
              '&:hover': { bgcolor: '#4e0f15' },
              borderRadius: '4px',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              px: 2
            }}
          >
            Criar Pedido
          </Button>
        </Box>
      </Paper>
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          px: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <TableContainer component={Paper} sx={{ 
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)', 
          borderRadius: '8px',
          overflow: 'hidden',
          width: '100%',
          mt: 0,
          height: 'calc(100vh - 180px)', // Ajusta para ocupar a maior parte da altura da tela
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Table stickyHeader sx={{ width: '100%' }} aria-label="tabela de componentes">
              <TableHead>
                <TableRow sx={{ 
                  backgroundColor: '#f5f5f5',
                  '& th': { 
                    fontWeight: 'bold', 
                    color: '#333',
                    fontSize: '0.85rem',
                    borderBottom: '2px solid #61131A',
                    py: 1.8
                  }
                }}>
                  <TableCell align="center">IDH</TableCell>
                  <TableCell align="center">Part Number</TableCell>
                  <TableCell align="center">Quantidade</TableCell>
                  <TableCell align="center">Categoria</TableCell>
                  <TableCell align="center">Caixa</TableCell>
                  <TableCell align="center">Mercado Livre</TableCell>
                  <TableCell align="center">Anunciado</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockItems.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                      '&:hover': { backgroundColor: 'rgba(97,19,26,0.04)' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: 'medium' }}>{item.id}</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}>{item.partNumber}</TableCell>
                    <TableCell align="center">{item.quantidade}</TableCell>
                    <TableCell align="center">Semicondutores</TableCell>
                    <TableCell align="center">{item.caixa}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        icon={item.mercadoLivre ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={item.mercadoLivre ? "Sim" : "Não"}
                        size="small"
                        sx={{ 
                          backgroundColor: item.mercadoLivre ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                          color: item.mercadoLivre ? '#27ae60' : '#e74c3c',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          '& .MuiChip-icon': { color: 'inherit' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        icon={item.anunciado ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={item.anunciado ? "Sim" : "Não"}
                        size="small"
                        sx={{ 
                          backgroundColor: item.anunciado ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                          color: item.anunciado ? '#27ae60' : '#e74c3c',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          '& .MuiChip-icon': { color: 'inherit' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          title="Editar" 
                          sx={{ 
                            color: '#2980b9', 
                            backgroundColor: 'rgba(41, 128, 185, 0.1)',
                            '&:hover': { backgroundColor: 'rgba(41, 128, 185, 0.2)' } 
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          title="Excluir" 
                          sx={{ 
                            color: '#c0392b', 
                            backgroundColor: 'rgba(192, 57, 43, 0.1)',
                            '&:hover': { backgroundColor: 'rgba(192, 57, 43, 0.2)' } 
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Adiciona linhas vazias para preencher espaço quando houver poucos itens */}
                {Array.from({ length: Math.max(0, 10 - mockItems.length) }).map((_, index) => (
                  <TableRow key={`empty-${index}`} sx={{ height: '53px' }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              borderTop: '1px solid rgba(224, 224, 224, 1)',
              backgroundColor: '#f9f9f9',
              overflowY: 'hidden',
              '& .MuiTablePagination-toolbar': {
                minHeight: '48px',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '0.875rem',
              }
            }}
          />
        </TableContainer>
      </Container>
    </div>
  );
};

export default Gerenciamento;

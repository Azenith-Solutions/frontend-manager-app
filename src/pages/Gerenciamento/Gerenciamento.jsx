import React, { useEffect, useState } from "react";
import styles from "./Gerenciamento.module.css";
import { api } from "../../provider/apiProvider";

// Material UI Components
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  Avatar
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
  const [totalComponents, setTotalComponents] = useState(0);

  // Imagem padrão para os componentes
  const defaultImage = "https://cdn.awsli.com.br/500x500/2599/2599375/produto/21644533946530777e3.jpg";

  useEffect(() => {
    document.title = "HardwareTech | Gerenciamento";
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      
      // Adicionando um delay artificial para mostrar a tela de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await api.get('/components');
      console.log('Resposta dos componentes:', response);
      
      const responseData = response.data.data || response.data;
      
      if (Array.isArray(responseData)) {
        setComponents(responseData);
        setTotalComponents(responseData.length);
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
      (item.descricao && item.descricao.toLowerCase().includes(searchText.toLowerCase())) ||
      item.idHardWareTech.toString().includes(searchText.toLowerCase())
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
            className={styles.searchInput}
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
          height: 'calc(100vh - 180px)',
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
                  <TableCell align="center">Componente</TableCell>
                  <TableCell align="center">IDH</TableCell>
                  <TableCell align="center">Part Number</TableCell>
                  <TableCell align="center">Quantidade</TableCell>
                  <TableCell align="center">Caixa</TableCell>
                  <TableCell align="center">Mercado Livre</TableCell>
                  <TableCell align="center">Verificado</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComponents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                  <TableRow
                    key={item.idComponente}
                    hover
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                      '&:hover': { backgroundColor: 'rgba(97,19,26,0.04)' },
                      transition: 'background-color 0.2s',
                      height: '54px' // Reduzindo a altura da linha de 60px para 54px
                    }}
                  >
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Avatar 
                        src={item.imagemUrl || defaultImage} 
                        variant="rounded"
                        alt={item.partNumber}
                        sx={{ 
                          width: 34, 
                          height: 34, 
                          margin: '0 auto',
                          bgcolor: '#ccc',
                          position: 'relative',
                          top: '-1px' // Ajustando ligeiramente a posição vertical
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'medium', py: 0.8 }}>{item.idHardWareTech}</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 'medium', py: 0.8 }}>{item.partNumber}</TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>{item.quantidade}</TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>{item.fkCaixa?.nomeCaixa || "N/A"}</TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Chip 
                        icon={item.flagML ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={item.flagML ? "Sim" : "Não"}
                        size="small"
                        sx={{ 
                          backgroundColor: item.flagML ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                          color: item.flagML ? '#27ae60' : '#e74c3c',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          '& .MuiChip-icon': { color: 'inherit' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Chip 
                        icon={item.flagVerificado ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={item.flagVerificado ? "Sim" : "Não"}
                        size="small"
                        sx={{ 
                          backgroundColor: item.flagVerificado ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                          color: item.flagVerificado ? '#27ae60' : '#e74c3c',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          '& .MuiChip-icon': { color: 'inherit' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>
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
                {filteredComponents.length > 0 && 
                 filteredComponents.length < rowsPerPage && 
                 Array.from({ length: Math.max(0, rowsPerPage - filteredComponents.length) }).map((_, index) => (
                  <TableRow key={`empty-${index}`} sx={{ height: '50px' }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                ))}
                {filteredComponents.length === 0 && (
                  <TableRow sx={{ height: '53px' }}>
                    <TableCell colSpan={8} align="center">
                      Nenhum componente encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={filteredComponents.length}
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

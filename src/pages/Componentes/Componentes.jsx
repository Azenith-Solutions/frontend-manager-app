import React, { Component, useEffect, useState } from "react";
import styles from "./componentes.module.css";
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
  Avatar,
  Divider,
  Card,
  CardContent
} from "@mui/material";

// Material UI Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Componentes = () => {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalComponents, setTotalComponents] = useState(0);

  // Imagem padrão para os componentes TESTE
  const defaultImage = "https://cdn.awsli.com.br/500x500/2599/2599375/produto/21644533946530777e3.jpg";

  useEffect(() => {
    document.title = "HardwareTech | Componentes";
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
          Carregando dados dos componentes...
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.componentes}>
      <Paper elevation={1} className={styles.toolbar} sx={{ 
        p: '10px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        mb: 2,
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          gap: '12px',
          flex: '1 1 auto',
          minWidth: '0', 
        }}>
          <Box
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: '250px' },
              minWidth: { xs: '100%', sm: '250px' },
              maxWidth: '300px',
              height: '38px',
              backgroundColor: '#f0f2f5',
              borderRadius: '20px',
              px: 1.5,
              overflow: 'hidden',
              border: '1px solid transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#e9ecf0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
              },
              '&:focus-within': {
                backgroundColor: '#fff',
                boxShadow: '0 0 0 2px rgba(97,19,26,0.1)',
                border: '1px solid #e0e0e0'
              }
            }}
          >
            <SearchIcon 
              sx={{ 
                color: '#61131A', 
                fontSize: 18,
                opacity: 0.7,
                mr: 1,
                transition: 'transform 0.2s ease',
                transform: 'rotate(-5deg)',
                '&:hover': {
                  transform: 'rotate(0deg) scale(1.1)'
                }
              }} 
            />
            <input 
              type="text" 
              placeholder="Buscar componente..."
              value={searchText}
              onChange={handleSearchChange}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#333',
                width: '100%',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '0px',
                fontFamily: 'inherit'
              }}
            />
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: '10px',
            flexShrink: 0,
          }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#f0f2f5',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid transparent',
                '&:hover': {
                  backgroundColor: '#e2e6eb',
                  transform: 'scale(1.02)',
                }
              }}
            >
              <FilterListIcon 
                fontSize="small" 
                sx={{ 
                  color: '#61131A',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)'
                  }
                }} 
              />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#444',
                  userSelect: 'none'
                }}
              >
                Filtrar
              </Typography>
            </Box>
            
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#f0f2f5',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid transparent',
                '&:hover': {
                  backgroundColor: '#e2e6eb',
                  transform: 'scale(1.02)',
                }
              }}
            >
              <FileDownloadIcon 
                fontSize="small" 
                sx={{ 
                  color: '#2980b9',
                  transition: 'transform 0.2s ease',
                }} 
              />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#444',
                  userSelect: 'none'
                }}
              >
                Exportar
              </Typography>
            </Box>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ 
            height: 28, 
            mx: 0.5,
            display: { xs: 'none', md: 'block' } 
          }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center', 
            gap: '12px',
            ml: { xs: 0, md: 0.5 },
            flexGrow: 1,
            justifyContent: { xs: 'flex-start', md: 'flex-start' },
          }}>
            <Card sx={{ 
              height: '38px', 
              flex: '1 1 140px',
              maxWidth: '180px',
              minWidth: '140px',
              borderTop: '3px solid #61131A',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              overflow: 'visible',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ 
                p: '4px 8px', 
                pb: '4px !important', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: '#ffeded',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    flexShrink: 0
                  }}>
                    <InventoryIcon sx={{ color: '#61131A', fontSize: 14 }} />
                  </Box>
                  <Box sx={{ 
                    minWidth: 0, 
                    overflow: 'hidden',
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 700, 
                      lineHeight: 1,
                      mb: 0,
                      color: '#333',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {totalComponents}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      fontSize: '0.6rem',
                      color: '#666',
                      fontWeight: 500,
                      lineHeight: 1,
                      mt: '0px',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      Cadastrados
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ 
              height: '38px', 
              flex: '1 1 170px', 
              maxWidth: '200px',
              minWidth: '170px',
              borderTop: '3px solid #27ae60',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              overflow: 'visible',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ 
                p: '4px 8px', 
                pb: '4px !important', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: '#eaf7ef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    flexShrink: 0
                  }}>
                    <StorefrontIcon sx={{ color: '#27ae60', fontSize: 14 }} />
                  </Box>
                  <Box sx={{ 
                    minWidth: 0, 
                    overflow: 'hidden', 
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 700, 
                      lineHeight: 1,
                      mb: 0,
                      color: '#333',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {components.filter(item => item.flagML).length}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      fontSize: '0.6rem',
                      color: '#666',
                      fontWeight: 500,
                      lineHeight: 1,
                      mt: '0px',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      Anunciados
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
        <Button 
          size="small" 
          variant="contained" 
          disableElevation
          startIcon={<AddIcon fontSize="small" />}
          sx={{ 
            height: '38px',
            bgcolor: '#61131A', 
            '&:hover': { bgcolor: '#4e0f15' },
            borderRadius: '4px',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            px: 1.5,
            minWidth: '100px',
            flexShrink: 0,
            ml: { xs: 0, sm: 'auto' }, 
            alignSelf: { xs: 'flex-start', sm: 'center' } 
          }}
        >
          Criar
        </Button>
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
                      height: '54px'
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

export default Componentes;

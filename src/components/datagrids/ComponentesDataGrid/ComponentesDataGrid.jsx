import React from "react";
import styles from "./ComponentesDataGrid.module.css";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";

// Material UI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * Componente de tabela para exibição dos dados de componentes de hardware
 */
const ComponentesDataGrid = ({
  components,
  filteredComponents,
  page,
  rowsPerPage,
  defaultImage,
  onEditComponent,
  onDeleteComponent,
  onPageChange,
  onRowsPerPageChange,
  loading = false
}) => {
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
    <div className={styles.componentesDataGrid}>
      <TableContainer component={Paper} className={styles.tableContainer} sx={{ 
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
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Condição</TableCell>
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
                      label={item.flagVerificado ? "Verificado" : "Não verificado"}
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
                    {item.flagVerificado ? (
                      item.condicao ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Chip 
                            label={item.condicao}
                            size="small"
                            sx={{ 
                              backgroundColor: item.condicao === 'Bom Estado' 
                                ? 'rgba(46, 204, 113, 0.1)' 
                                : (item.condicao === 'Observação' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)'),
                              color: item.condicao === 'Bom Estado' 
                                ? '#27ae60' 
                                : (item.condicao === 'Observação' ? '#e74c3c' : '#3498db'),
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              borderRadius: '4px',
                            }}
                          />
                          {item.condicao === 'Observação' && item.observacao && (
                            <Tooltip
                              title={
                                <Typography variant="body2" sx={{ p: 1 }}>
                                  {item.observacao}
                                </Typography>
                              }
                              arrow
                              placement="top"
                            >
                              <IconButton size="small" sx={{ p: 0.3, ml: 0.2, color: '#e74c3c' }}>
                                <InfoOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#777', fontStyle: 'italic' }}>
                          Não informada
                        </Typography>
                      )
                    ) : (
                      <Typography variant="caption" sx={{ color: '#777', fontStyle: 'italic' }}>
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.8 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        title="Editar" 
                        onClick={() => onEditComponent(item)}
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
                        onClick={() => onDeleteComponent && onDeleteComponent(item)} 
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
                  <TableCell colSpan={9} />
                </TableRow>
              ))}
              {filteredComponents.length === 0 && (
                <TableRow sx={{ height: '53px' }}>
                  <TableCell colSpan={9} align="center">
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
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
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
    </div>
  );
};

export default ComponentesDataGrid;
import React, { useState } from "react";
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
  CircularProgress,
  Collapse,
  Switch,
  FormControlLabel
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const API_IMAGES_URL = "http://localhost:8080/api/uploads/images/";

/**
 * Formata o valor da condição do componente
 */
const formatCondition = (condition) => {
  if (!condition) return '';
  
  const conditionUpper = condition.toUpperCase();
  
  if (conditionUpper === 'BOM_ESTADO' || conditionUpper === 'BOMESTADO') {
    return 'Bom Estado';
  }
  
  if (conditionUpper === 'EM_OBSERVACAO' || conditionUpper === 'EMOBSERVACAO' || 
      conditionUpper === 'OBSERVACAO' || conditionUpper === 'OBSERVAÇÃO') {
    return 'Em Observação';
  }
  
  return condition;
};

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
  onToggleCatalog,
  loading = false
}) => {
  // Estado para controlar a linha expandida (mostrar descrição)
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Manipular o clique em uma linha
  const handleRowClick = (idComponente) => {
    setExpandedRow(expandedRow === idComponente ? null : idComponente);
  };

  // Função para lidar com a mudança do toggle de catálogo
  const handleCatalogToggle = (event, componentId, currentValue) => {
    event.stopPropagation();
    if (onToggleCatalog) {
      onToggleCatalog(componentId, !currentValue);
    }
  };

  // Função para obter a URL da imagem do componente
  const getImageUrl = (item) => {
    if (item.imagem) {
      return `${API_IMAGES_URL}${item.imagem}`;
    }
    return defaultImage;
  };

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
                <TableCell align="center" width="40px"></TableCell>
                <TableCell align="center">Componente</TableCell>
                <TableCell align="center">IDH</TableCell>
                <TableCell align="center">Nome</TableCell>
                <TableCell align="center">Part Number</TableCell>
                <TableCell align="center">Quantidade</TableCell>
                <TableCell align="center">Caixa</TableCell>
                <TableCell align="center">Mercado Livre</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Condição</TableCell>
                <TableCell align="center">Catálogo</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComponents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                <>
                  <TableRow
                    key={item.idComponente}
                    hover
                    onClick={() => handleRowClick(item.idComponente)}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                      '&:hover': { 
                        backgroundColor: 'rgba(97,19,26,0.04)',
                        cursor: 'pointer' 
                      },
                      transition: 'background-color 0.2s',
                      height: '54px'
                    }}
                  >
                    <TableCell padding="checkbox" align="center">
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item.idComponente);
                        }}
                      >
                        {expandedRow === item.idComponente ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Avatar 
                        src={getImageUrl(item)} 
                        variant="rounded"
                        alt={item.nomeComponente || item.partNumber}
                        sx={{ 
                          width: 34, 
                          height: 34, 
                          margin: '0 auto',
                          bgcolor: '#ccc',
                          position: 'relative',
                          top: '-1px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'medium', py: 0.8 }}>{item.idHardWareTech}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'medium', py: 0.8 }}>{item.nomeComponente || "Sem nome"}</TableCell>
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
                              label={formatCondition(item.condicao)}
                              size="small"
                              sx={{ 
                                backgroundColor: formatCondition(item.condicao) === 'Bom Estado' 
                                  ? 'rgba(46, 204, 113, 0.1)' 
                                  : 'rgba(231, 76, 60, 0.1)',
                                color: formatCondition(item.condicao) === 'Bom Estado' 
                                  ? '#27ae60' 
                                  : '#e74c3c',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                borderRadius: '4px',
                              }}
                            />
                            {formatCondition(item.condicao) === 'Em Observação' && item.observacao && (
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
                      <Box 
                        onClick={(e) => e.stopPropagation()}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCatalog && onToggleCatalog(item.idComponente, !item.isVisibleCatalog);
                          }}
                          sx={{ 
                            color: item.isVisibleCatalog ? '#27ae60' : '#e74c3c',
                            backgroundColor: item.isVisibleCatalog ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                            '&:hover': { 
                              backgroundColor: item.isVisibleCatalog ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'
                            },
                            p: 1
                          }}
                        >
                          {item.isVisibleCatalog ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                        </IconButton>
                        <Typography variant="caption" sx={{ ml: 1, fontWeight: 'medium', color: item.isVisibleCatalog ? '#27ae60' : '#e74c3c' }}>
                          {item.isVisibleCatalog ? "Visível" : "Oculto"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          title="Editar" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditComponent(item);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteComponent && onDeleteComponent(item);
                          }} 
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
                  {/* Linha expandida para mostrar a descrição */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                      <Collapse in={expandedRow === item.idComponente} timeout="auto" unmountOnExit>
                        <Box 
                          sx={{ 
                            margin: 1, 
                            px: 2,
                            py: 1.5, 
                            backgroundColor: 'rgba(97,19,26,0.03)',
                            borderRadius: '4px',
                            border: '1px solid rgba(97,19,26,0.1)'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <DescriptionIcon sx={{ fontSize: '1rem', color: '#61131A', mt: 0.3 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#61131A' }}>
                              Descrição:
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ pl: 3, pt: 0.5, color: item.descricao ? '#333' : '#777', fontStyle: item.descricao ? 'normal' : 'italic' }}>
                            {item.descricao ? item.descricao : "Não informada"}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
              {filteredComponents.length > 0 && 
              filteredComponents.length < rowsPerPage && 
              Array.from({ length: Math.max(0, rowsPerPage - filteredComponents.length) }).map((_, index) => (
                <TableRow key={`empty-${index}`} sx={{ height: '50px' }}>
                  <TableCell colSpan={10} />
                </TableRow>
              ))}
              {filteredComponents.length === 0 && (
                <TableRow sx={{ height: '53px' }}>
                  <TableCell colSpan={10} align="center">
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
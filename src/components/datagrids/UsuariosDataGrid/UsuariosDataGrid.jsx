import React from "react";
import styles from "./UsuariosDataGrid.module.css";
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
  CircularProgress
} from "@mui/material";

// Material UI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Componente de tabela para exibição dos dados de usuários do sistema
 */
const UsuariosDataGrid = ({
  usuarios,
  page,
  rowsPerPage,
  onEditUser,
  onDeleteUser,
  onPageChange,
  onRowsPerPageChange,
  updatedUserId,
  deletedUserId,
  loading = false
}) => {
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '300px'
      }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dados de usuários...
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.usuariosDataGrid}>
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
          <Table stickyHeader sx={{ width: '100%' }} aria-label="tabela de usuários">
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
                <TableCell align="center">Avatar</TableCell>
                <TableCell align="center">Nome</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Cargo</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Criado em</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>            <TableBody>
              {usuarios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                      '&:hover': { backgroundColor: 'rgba(97,19,26,0.04)' },                      
                      transition: 'background-color 0.3s, box-shadow 0.3s, opacity 0.5s',
                      height: '54px',
                      ...(updatedUserId === item.id && {
                        backgroundColor: 'rgba(97, 19, 26, 0.08)',
                        boxShadow: 'inset 0 0 0 1px rgba(97, 19, 26, 0.3)',
                        animation: 'pulse 1.5s',
                        '@keyframes pulse': {
                          '0%': { backgroundColor: 'rgba(97, 19, 26, 0.2)' },
                          '50%': { backgroundColor: 'rgba(97, 19, 26, 0.05)' },
                          '100%': { backgroundColor: 'rgba(97, 19, 26, 0.1)' }
                        }
                      }),
                      ...(deletedUserId === item.id && {
                        opacity: 0.3,
                        backgroundColor: 'rgba(255, 0, 0, 0.05)',
                        animation: 'fadeOut 1.5s',
                        '@keyframes fadeOut': {
                          '0%': { opacity: 1, backgroundColor: 'rgba(255, 0, 0, 0.1)' },
                          '100%': { opacity: 0.3, backgroundColor: 'rgba(255, 0, 0, 0.05)' }
                        }
                      })
                    }}
                  >
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Avatar 
                        src={item.avatar} 
                        alt={item.nome}
                        sx={{ 
                          width: 34, 
                          height: 34, 
                          margin: '0 auto',
                          bgcolor: '#61131A' // Using brand color as fallback
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'medium', py: 0.8 }}>{item.nome}</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 'medium', py: 0.8 }}>{item.email}</TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>{item.cargo}</TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Chip 
                        icon={item.status === 'Ativo' ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        label={item.status}
                        size="small"
                        sx={{ 
                          backgroundColor: item.status === 'Ativo' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                          color: item.status === 'Ativo' ? '#27ae60' : '#e74c3c',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          '& .MuiChip-icon': { color: 'inherit' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>{item.criadoEm}</TableCell>
                    <TableCell align="center" sx={{ py: 0.8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          title="Editar" 
                          onClick={() => onEditUser(item)}
                          sx={{ 
                            color: '#d4a31a', 
                            backgroundColor: '#ebb2142f',
                            '&:hover': { backgroundColor: '#ebb21447' } 
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          title="Excluir" 
                          onClick={() => onDeleteUser(item)}
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
                ))}              {usuarios.length > 0 && 
               usuarios.length < rowsPerPage && 
               Array.from({ length: Math.max(0, rowsPerPage - usuarios.length) }).map((_, index) => (
                <TableRow key={`empty-${index}`} sx={{ height: '50px' }}>
                  <TableCell colSpan={7} />
                </TableRow>
              ))}
              {usuarios.length === 0 && (
                <TableRow sx={{ height: '53px' }}>
                  <TableCell colSpan={7} align="center">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>        <TablePagination
          component="div"
          count={usuarios.length}
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

export default UsuariosDataGrid;

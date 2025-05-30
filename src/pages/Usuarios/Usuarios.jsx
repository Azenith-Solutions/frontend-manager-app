import React, { useEffect, useState, useMemo } from "react";
import styles from "./Usuarios.module.css";
import { api } from "../../service/api";
import UserFormModal from "../../components/forms/UserFormModal/UserFormModal";
import UserEditModal from "../../components/forms/UserFormModal/UserEditModal";
import UserDeleteModal from "../../components/forms/UserFormModal/UserDeleteModal";
import UsuariosFilter from "../../components/menuFilter/UsuariosFilter";
import UsuariosDataGrid from "../../components/datagrids/UsuariosDataGrid/UsuariosDataGrid";
import DatagridHeader from "../../components/headerDataGrids/DatagridHeader";

// URL base para imagens de perfil
const API_BASE_URL = "http://localhost:8080/api/uploads/images/";
// Standardized avatar URL (fallback quando não há imagem de perfil)
const STANDARD_AVATAR = "https://ui-avatars.com/api/?background=61131A&color=fff&bold=true&font-size=0.33";

// Material UI Components
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Snackbar,
  Alert
} from "@mui/material";

// Material UI Icons
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Usuarios = () => {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Estados para controlar o menu de filtros
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  // Estado para armazenar filtros ativos
  const [activeFilters, setActiveFilters] = useState({
    cargo: [],
    status: null,
    periodo: null
  });

  useEffect(() => {
    document.title = "HardwareTech | Usuários";
    fetchUsuarios();
  }, []);

  // Atualizar a contagem de usuários quando a lista mudar
  useEffect(() => {
    setTotalUsuarios(usuarios.length);
  }, [usuarios]);
  // Funções para gerenciar os filtros
  const handleOpenFilterMenu = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const toggleCargoFilter = (cargo) => {
    setActiveFilters(prev => {
      const newCargo = prev.cargo.includes(cargo)
        ? prev.cargo.filter(item => item !== cargo)
        : [...prev.cargo, cargo];

      return { ...prev, cargo: newCargo };
    });
    setPage(0); // Reset page when filter changes
  };

  const toggleStatusFilter = (status) => {
    setActiveFilters(prev => ({
      ...prev,
      status: prev.status === status ? null : status
    }));
    setPage(0); // Reset page when filter changes
  };

  const togglePeriodoFilter = (periodo) => {
    setActiveFilters(prev => ({
      ...prev,
      periodo: prev.periodo === periodo ? null : periodo
    }));
    setPage(0); // Reset page when filter changes
  };

  const clearAllFilters = () => {
    setActiveFilters({
      cargo: [],
      status: null,
      periodo: null
    });
    setPage(0); // Reset page when filters are cleared
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);

      const response = await api.get('/users');
      console.log('Resposta da API:', response.data);

      if (response.data && response.data.data) {
        const usuariosAPI = response.data.data.map(user => {
          // Extrair iniciais para o avatar
          const iniciais = user.fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2);

          return {
            id: user.id,
            nome: user.fullName,
            email: user.email,
            cargo: user.role,
            status: statusDisplay,
            criadoEm: user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A',
            avatar: avatarUrl,
            // Dados originais para facilitar a edição
            rawData: user
          };
        });

        setUsuarios(usuariosAPI);
        setTotalUsuarios(usuariosAPI.length);
      } else {
        console.error('Formato de resposta inesperado:', response);
        setUsuarios([]);
        setTotalUsuarios(0);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setUsuarios([]);
      setTotalUsuarios(0);
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

  // Handlers para o menu de filtros
  const handleFilterMenuClick = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // Manipuladores de filtros para Usuários
  const toggleCargoFilter = (cargo) => {
    setActiveFilters(prev => {
      const updatedCargos = prev.cargo.includes(cargo)
        ? prev.cargo.filter(c => c !== cargo)
        : [...prev.cargo, cargo];

      return { ...prev, cargo: updatedCargos };
    });
    setPage(0);
  };

  const toggleStatusFilter = (status) => {
    setActiveFilters(prev => ({
      ...prev,
      status: prev.status === status ? null : status
    }));
    setPage(0);
  };

  const togglePeriodoFilter = (periodo) => {
    setActiveFilters(prev => ({
      ...prev,
      periodo: prev.periodo === periodo ? null : periodo
    }));
    setPage(0);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      cargo: [],
      status: null,
      periodo: null
    });
    setPage(0);
  };

  // Contagem de filtros ativos
  const activeFilterCount = [
    activeFilters.cargo.length > 0,
    activeFilters.status !== null,
    activeFilters.periodo !== null
  ].filter(Boolean).length;

  // Aplicar filtros aos usuários
  const filteredUsuarios = usuarios.filter(item => {
    // Filtro de texto/busca
    const matchesSearch = (
      (item.nome && item.nome.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.cargo && item.cargo.toLowerCase().includes(searchText.toLowerCase()))
    );

    // Filtro por cargo
    const matchesCargo = activeFilters.cargo.length === 0 ||
      (item.cargo && activeFilters.cargo.includes(item.cargo));

    // Filtro por status
    const matchesStatus = activeFilters.status === null ||
      item.status === activeFilters.status;

    // Filtro por período (simplificado, em produção usaria datas reais)
    const matchesPeriodo = activeFilters.periodo === null || true; // Simplificação

    return matchesSearch && matchesCargo && matchesStatus && matchesPeriodo;
  });

  // Função para abrir formulário de novo usuário
  const handleAddUsuario = () => {
    setModalOpen(true);
  };

  // Cartões de estatísticas para o header
  const statsCards = [
    {
      icon: <PeopleIcon sx={{ color: '#61131A', fontSize: 14 }} />,
      iconBgColor: '#ffeded',
      color: '#61131A',
      value: totalUsuarios,
      label: 'Usuários'
    },
    {
      icon: <AdminPanelSettingsIcon sx={{ color: '#27ae60', fontSize: 14 }} />,
      iconBgColor: '#eaf7ef',
      color: '#27ae60',
      value: usuarios.filter(item => item.cargo === 'Administrador' || item.cargo === 'Administrator').length,
      label: 'Administradores'
    }
  ];

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dados de usuários...
        </Typography>
      </Box>
    );
  }
  return (
    <div className={styles.usuarios}>
      {/* Utilizando o componente DatagridHeader genérico */}
      <DatagridHeader
        title="Novo Usuário"
        searchPlaceholder="Buscar usuário..."
        searchProps={{
          value: searchText,
          onChange: handleSearchChange
        }}
        onAddClick={handleAddUsuario}
        activeFilterCount={activeFilterCount}
        onFilterClick={handleFilterMenuClick}
        statsCards={statsCards}
      />

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
              </TableHead>
              <TableBody>
                {filteredUsuarios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow
                      key={item.id}
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
                {filteredUsuarios.length > 0 &&
                  filteredUsuarios.length < rowsPerPage &&
                  Array.from({ length: Math.max(0, rowsPerPage - filteredUsuarios.length) }).map((_, index) => (
                    <TableRow key={`empty-${index}`} sx={{ height: '50px' }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  ))}
                {filteredUsuarios.length === 0 && (
                  <TableRow sx={{ height: '53px' }}>
                    <TableCell colSpan={7} align="center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={filteredUsuarios.length}
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

      {/* Menu de Filtros usando o componente específico */}
      <UsuariosFilter
        anchorEl={filterMenuAnchor}
        onClose={handleFilterMenuClose}
        activeFilters={activeFilters}
        toggleCargoFilter={toggleCargoFilter}
        toggleStatusFilter={toggleStatusFilter}
        togglePeriodoFilter={togglePeriodoFilter}
        clearAllFilters={clearAllFilters}
      />

      {/* Modal for creating a new user */}
      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchUsuarios(); // Recarrega a lista após o cadastro
        }}
      />
      {/* Modal for editing a user */}
      <UserEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserUpdated={() => {
          // Marcar o ID do usuário atualizado antes de buscar os dados
          if (selectedUser) {
            setUpdatedUserId(selectedUser.id);
          }
          fetchUsuarios();

          // Limpar o ID após 2 segundos para remover o efeito de destaque
          setTimeout(() => {
            setUpdatedUserId(null);
          }, 2000);
        }}
      />

      {/* Modal for deleting a user */}      <UserDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserDeleted={() => {
          // Marcar o ID do usuário excluído antes de buscar os dados
          if (selectedUser) {
            setDeletedUserId(selectedUser.id);

            // Atualizar a lista localmente removendo o usuário
            setUsuarios(prev => prev.filter(user => user.id !== selectedUser.id));

            // Mostrar mensagem de feedback
            setFeedbackMessage({
              open: true,
              message: `Usuário ${selectedUser.nome} excluído com sucesso!`,
              severity: 'success'
            });

            // Limpar o ID após 2 segundos
            setTimeout(() => {
              setDeletedUserId(null);
            }, 2000);
          }
        }}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={feedbackMessage.open}
        autoHideDuration={5000}
        onClose={() => setFeedbackMessage(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFeedbackMessage(prev => ({ ...prev, open: false }))}
          severity={feedbackMessage.severity}
          variant="filled"
          sx={{
            width: '100%',
            maxWidth: '400px',
            fontSize: '0.9rem'
          }}
        >
          {feedbackMessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export { Usuarios };
import React, { useEffect, useState, useMemo } from "react";
import styles from "./Usuarios.module.css";
import { api } from "../../provider/apiProvider";
import UserFormModal from "../../components/forms/UserFormModal/UserFormModal";
import UserEditModal from "../../components/forms/UserFormModal/UserEditModal";
import UserDeleteModal from "../../components/forms/UserFormModal/UserDeleteModal";
import UsuariosFilter from "../../components/menuFilter/UsuariosFilter";
import UsuariosDataGrid from "../../components/datagrids/UsuariosDataGrid/UsuariosDataGrid";
import DatagridHeader from "../../components/headerDataGrids/DatagridHeader";

// Standardized avatar URL
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUserId, setUpdatedUserId] = useState(null);
  const [deletedUserId, setDeletedUserId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState({ open: false, message: '', severity: 'success' });
  
  // Estado para controle do menu de filtros
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    cargo: [],
    status: null,
    periodo: null
  });
  const [filteredCount, setFilteredCount] = useState(0);
  
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
            status: user.status ? 'Ativo' : 'Inativo',
            criadoEm: user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A',
            avatar: `${STANDARD_AVATAR}&name=${encodeURIComponent(iniciais)}`,
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
    // Função para lidar com o clique no botão de editar
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };
  
  // Função para lidar com o clique no botão de excluir
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  // Função para filtrar usuários com base em filtros e texto de busca
  const filteredUsuarios = useMemo(() => {
    // Primeiro filtra por texto de busca
    let filtered = usuarios.filter(
      (item) => 
        (item.nome && item.nome.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.cargo && item.cargo.toLowerCase().includes(searchText.toLowerCase()))
    );
    
    // Aplica filtro de cargo
    if (activeFilters.cargo.length > 0) {
      filtered = filtered.filter(item => activeFilters.cargo.includes(item.cargo));
    }
    
    // Aplica filtro de status
    if (activeFilters.status !== null) {
      filtered = filtered.filter(item => item.status === activeFilters.status);
    }
    
    // Aplica filtro de período
    if (activeFilters.periodo !== null) {
      const hoje = new Date();
      const dataLimite = new Date();
      
      switch(activeFilters.periodo) {
        case '7dias':
          dataLimite.setDate(hoje.getDate() - 7);
          break;
        case '30dias':
          dataLimite.setDate(hoje.getDate() - 30);
          break;
        case '90dias':
          dataLimite.setDate(hoje.getDate() - 90);
          break;
        case 'ano':
          dataLimite.setFullYear(hoje.getFullYear(), 0, 1); // 1º de janeiro do ano atual
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(item => {
        const dataCriacao = new Date(item.rawData.createdAt);
        return dataCriacao >= dataLimite;
      });
    }
    
    return filtered;
  }, [usuarios, searchText, activeFilters.cargo, activeFilters.status, activeFilters.periodo]);
  
  // Calculando filteredCount fora da função de filtragem para evitar loops de renderização
  useEffect(() => {
    setFilteredCount(usuarios.length - filteredUsuarios.length);
  }, [usuarios, filteredUsuarios.length]);

  // Recalcular os usuários filtrados quando os filtros mudarem
  useEffect(() => {
    // Quando o componente montar, já teremos o lista inicial de usuários
    // Este efeito é apenas para garantir que a contagem de filtrados seja atualizada
    // quando os filtros mudarem
  }, [searchText, activeFilters.cargo, activeFilters.status, activeFilters.periodo]);

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
      {/* DatagridHeader para a página de usuários */}
      <DatagridHeader
        title="Novo Usuário"
        searchPlaceholder="Buscar usuário..."
        searchProps={{
          value: searchText,
          onChange: handleSearchChange
        }}
        onAddClick={() => setModalOpen(true)}
        activeFilterCount={Object.values(activeFilters).some(v => Array.isArray(v) ? v.length > 0 : v !== null) ? filteredCount : 0}
        onFilterClick={handleOpenFilterMenu}
        statsCards={[
          {
            icon: <PeopleIcon fontSize="small" sx={{ color: '#61131A' }} />,
            value: totalUsuarios,
            label: 'Usuários',
            color: '#61131A',
            iconBgColor: '#ffeded'
          },
          {
            icon: <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#27ae60' }} />,
            value: usuarios.filter(item => item.cargo === 'Administrador' || item.cargo === 'Administrator').length,
            label: 'Administradores',
            color: '#27ae60',
            iconBgColor: '#eaf7ef'
          }
        ]}
      />
      
      {/* Componente UsuariosFilter */}
      <UsuariosFilter
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilterMenu}
        activeFilters={activeFilters}
        toggleCargoFilter={toggleCargoFilter}
        toggleStatusFilter={toggleStatusFilter}
        togglePeriodoFilter={togglePeriodoFilter}
        clearAllFilters={clearAllFilters}      />
      
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
        <UsuariosDataGrid
          usuarios={filteredUsuarios}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          updatedUserId={updatedUserId}
          deletedUserId={deletedUserId}
          loading={loading}
        />
      </Container>
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
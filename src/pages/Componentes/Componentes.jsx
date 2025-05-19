import React, { useEffect, useState } from "react";
import styles from "./Componentes.module.css";
import { api } from "../../provider/apiProvider";
import ComponentFormModal from "../../components/forms/ComponentFormModal/ComponentFormModal";
import ComponentesDataGrid from "../../components/datagrids/ComponentesDataGrid/ComponentesDataGrid";
import ComponentDeleteModal from "../../components/forms/ComponentDeleteModal/ComponentDeleteModal";

// Componentes genéricos para header e filtro
import DatagridHeader from "../../components/headerDataGrids/DatagridHeader";
import ComponentesFilter from "../../components/menuFilter/ComponentesFilter";

// Material UI Components
import {
  Box,
  CircularProgress,
  Typography,
  Container
} from "@mui/material";

// Material UI Icons
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Componentes = () => {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalComponents, setTotalComponents] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  
  // Estados para controlar o menu de filtros
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [availableCaixas, setAvailableCaixas] = useState([]);
  
  // Estado para armazenar filtros ativos
  const [activeFilters, setActiveFilters] = useState({
    caixas: [],
    mercadoLivre: null, // true, false, ou null (não filtrado)
    verificado: null, // true, false, ou null (não filtrado)
    condicao: [] // 'Bom Estado', 'Observação', ou vazio (não filtrado)
  });

  // Imagem padrão para os componentes
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
        
        // Extrair caixas únicas para o filtro
        const caixas = [...new Set(responseData
          .filter(item => item.fkCaixa?.nomeCaixa)
          .map(item => item.fkCaixa.nomeCaixa))];
        setAvailableCaixas(caixas);
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
  
  // Handlers para o menu de filtros
  const handleFilterMenuClick = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };
  
  // Manipuladores de filtros
  const toggleCaixaFilter = (caixaNome) => {
    setActiveFilters(prev => {
      const updatedCaixas = prev.caixas.includes(caixaNome)
        ? prev.caixas.filter(c => c !== caixaNome)
        : [...prev.caixas, caixaNome];
      
      return { ...prev, caixas: updatedCaixas };
    });
    setPage(0);
  };

  const toggleMercadoLivreFilter = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      mercadoLivre: prev.mercadoLivre === value ? null : value
    }));
    setPage(0);
  };

  const toggleVerificadoFilter = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      verificado: prev.verificado === value ? null : value
    }));
    setPage(0);
  };

  const toggleCondicaoFilter = (condicao) => {
    setActiveFilters(prev => {
      const updatedCondicoes = prev.condicao.includes(condicao)
        ? prev.condicao.filter(c => c !== condicao)
        : [...prev.condicao, condicao];
      
      return { ...prev, condicao: updatedCondicoes };
    });
    setPage(0);
  };
  
  const clearAllFilters = () => {
    setActiveFilters({
      caixas: [],
      mercadoLivre: null,
      verificado: null,
      condicao: []
    });
    setPage(0);
  };
  
  // Contagem de filtros ativos
  const activeFilterCount = [
    activeFilters.caixas.length > 0,
    activeFilters.mercadoLivre !== null,
    activeFilters.verificado !== null,
    activeFilters.condicao.length > 0
  ].filter(Boolean).length;

  // Aplicar filtros aos componentes
  const filteredComponents = components.filter(item => {
    // Filtro de texto/busca
    const matchesSearch = (
      item.partNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.descricao && item.descricao.toLowerCase().includes(searchText.toLowerCase())) ||
      item.idHardWareTech.toString().includes(searchText.toLowerCase())
    );
    
    // Filtro por caixa
    const matchesCaixa = activeFilters.caixas.length === 0 || 
      (item.fkCaixa && activeFilters.caixas.includes(item.fkCaixa.nomeCaixa));
    
    // Filtro por Mercado Livre
    const matchesML = activeFilters.mercadoLivre === null || 
      item.flagML === activeFilters.mercadoLivre;
    
    // Filtro por verificado
    const matchesVerificado = activeFilters.verificado === null || 
      item.flagVerificado === activeFilters.verificado;
    
    // Filtro por condição
    const matchesCondicao = activeFilters.condicao.length === 0 || 
      (item.condicao && activeFilters.condicao.includes(item.condicao));
    
    return matchesSearch && matchesCaixa && matchesML && matchesVerificado && matchesCondicao;
  });
  
  // Nova função para abrir modal de edição
  const handleEditComponent = (component) => {
    setComponentToEdit(component);
    setModalOpen(true);
  };

  // Função para abrir modal de criação
  const handleAddComponent = () => {
    setComponentToEdit(null);
    setModalOpen(true);
  };
  
  // Função para fechar modal e recarregar a lista
  const handleCloseModal = () => {
    setModalOpen(false);
    fetchComponents();
  };

  // Handler para excluir componente (abre o modal)
  const handleDeleteComponent = (component) => {
    setComponentToDelete(component);
    setDeleteModalOpen(true);
  };

  // Handler para fechar o modal de deleção e recarregar a lista
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setComponentToDelete(null);
    fetchComponents();
  };

  // Cartões de estatísticas para o header
  const statsCards = [
    {
      icon: <InventoryIcon sx={{ color: '#61131A', fontSize: 14 }} />,
      iconBgColor: '#ffeded',
      color: '#61131A',
      value: totalComponents,
      label: 'Cadastrados'
    },
    {
      icon: <StorefrontIcon sx={{ color: '#27ae60', fontSize: 14 }} />,
      iconBgColor: '#eaf7ef',
      color: '#27ae60',
      value: components.filter(item => item.flagML).length,
      label: 'Anunciados'
    }
  ];

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
      {/* Utilizando o componente DatagridHeader genérico */}
      <DatagridHeader 
        title="Adicionar componente"
        searchPlaceholder="Buscar componente..."
        searchProps={{
          value: searchText,
          onChange: handleSearchChange
        }}
        onAddClick={handleAddComponent}
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
        {/* Substituindo a tabela pelo componente ComponentesDataGrid */}
        <ComponentesDataGrid 
          components={components}
          filteredComponents={filteredComponents}
          page={page}
          rowsPerPage={rowsPerPage}
          defaultImage={defaultImage}
          onEditComponent={handleEditComponent}
          onDeleteComponent={handleDeleteComponent}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      {/* Menu de Filtros - usando o componente específico */}
      <ComponentesFilter
        anchorEl={filterMenuAnchor}
        onClose={handleFilterMenuClose}
        availableCaixas={availableCaixas}
        activeFilters={activeFilters}
        toggleCaixaFilter={toggleCaixaFilter}
        toggleMercadoLivreFilter={toggleMercadoLivreFilter}
        toggleVerificadoFilter={toggleVerificadoFilter}
        toggleCondicaoFilter={toggleCondicaoFilter}
        clearAllFilters={clearAllFilters}
      />

      {/* Modal do formulário de componente */}
      <ComponentFormModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        componentToEdit={componentToEdit}
      />

      {/* Modal de deleção de componente */}
      <ComponentDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        component={componentToDelete}
        onComponentDeleted={handleCloseDeleteModal}
      />
    </div>
  );
};

export default Componentes;

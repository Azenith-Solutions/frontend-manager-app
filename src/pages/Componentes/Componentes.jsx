import React, { useState, useEffect } from "react";
import styles from "./Componentes.module.css";
import { api } from "../../service/api";
import ComponentFormModal from "../../components/forms/ComponentFormModal/ComponentFormModal";
import ComponentesDataGrid from "../../components/datagrids/ComponentesDataGrid/ComponentesDataGrid";
import ComponentDeleteModal from "../../components/forms/ComponentDeleteModal/ComponentDeleteModal";
import CatalogVisibilityModal from "../../components/forms/CatalogVisibilityModal/CatalogVisibilityModal";

// Componentes genéricos para header e filtro
import DatagridHeader from "../../components/headerDataGrids/DatagridHeader";
import ComponentesFilter from "../../components/menuFilter/ComponentesFilter";

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
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Componentes = () => {
  // Estados para a página
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalComponents, setTotalComponents] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [componentToToggleVisibility, setComponentToToggleVisibility] = useState(null);
  const [newVisibilityValue, setNewVisibilityValue] = useState(false);
  const [toggleVisibilityLoading, setToggleVisibilityLoading] = useState(false);
  
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [availableCaixas, setAvailableCaixas] = useState([]);

  const [activeFilters, setActiveFilters] = useState({
    caixas: [],
    mercadoLivre: null,
    verificado: null, 
    condicao: [] 
  });

  // Imagem padrão para os componentes
  const defaultImage = "https://cdn.awsli.com.br/500x500/2599/2599375/produto/21644533946530777e3.jpg";

  // Definição dos cabeçalhos para exportação
  const exportHeaders = [
    { id: 'idComponente', label: 'ID' },
    { id: 'idHardWareTech', label: 'IDH' },
    { id: 'nomeComponente', label: 'Nome' },
    { id: 'partNumber', label: 'Part Number' },
    { id: 'descricao', label: 'Descrição' },
    { id: 'quantidade', label: 'Quantidade' },
    { id: 'fkCaixa.nomeCaixa', label: 'Caixa' },
    { id: 'flagML', label: 'Mercado Livre' },
    { id: 'flagVerificado', label: 'Verificado' },
    { id: 'condicao', label: 'Condição' },
    { id: 'observacao', label: 'Observação' },
    { id: 'isVisibleCatalog', label: 'Visível no Catálogo' }
  ];

  useEffect(() => {
    document.title = "HardwareTech | Componentes";
    fetchComponents();
    fetchAvailableCaixas();
  }, []);

  // Função para buscar as caixas disponíveis para filtro
  const fetchAvailableCaixas = async () => {
    try {
      // Extrai as caixas únicas dos componentes
      const caixas = components
        .filter(comp => comp.fkCaixa?.nomeCaixa)
        .map(comp => comp.fkCaixa.nomeCaixa);
      
      // Remove duplicatas
      const uniqueCaixas = [...new Set(caixas)];
      setAvailableCaixas(uniqueCaixas);
    } catch (error) {
      console.error('Erro ao buscar caixas:', error);
      setAvailableCaixas([]);
    }
  };

  // Funções para gerenciar os filtros
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  const toggleCaixaFilter = (caixa) => {
    setActiveFilters(prev => {
      const newCaixas = prev.caixas.includes(caixa)
        ? prev.caixas.filter(item => item !== caixa)
        : [...prev.caixas, caixa];

      return { ...prev, caixas: newCaixas };
    });
    setPage(0); // Reset page when filter changes
  };

  const toggleMercadoLivreFilter = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      mercadoLivre: prev.mercadoLivre === value ? null : value
    }));
    setPage(0); // Reset page when filter changes
  };

  const toggleVerificadoFilter = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      verificado: prev.verificado === value ? null : value,
      // Limpar os filtros de condição se verificado for falso
      condicao: value === false ? [] : prev.condicao
    }));
    setPage(0); // Reset page when filter changes
  };

  const toggleCondicaoFilter = (condicao) => {
    setActiveFilters(prev => {
      const newCondicao = prev.condicao.includes(condicao)
        ? prev.condicao.filter(item => item !== condicao)
        : [...prev.condicao, condicao];

      return { ...prev, condicao: newCondicao };
    });
    setPage(0); // Reset page when filter changes
  };

  const clearAllFilters = () => {
    setActiveFilters({
      caixas: [],
      mercadoLivre: null,
      verificado: null,
      condicao: []
    });
    setPage(0); // Reset page when filters are cleared
  };

  const fetchComponents = async () => {
    try {
      setLoading(true);

      // Tentar buscar do API
      try {
        const response = await api.get('/components');
        console.log('Resposta dos componentes:', response);

        const responseData = response.data.data || response.data;

        if (Array.isArray(responseData)) {
          setComponents(responseData);
          setFilteredComponents(responseData);
          setTotalComponents(responseData.length);
        } else {
          console.error('Dados recebidos não são um array:', responseData);
          setComponents([]);
          setFilteredComponents([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        // Carregar dados simulados caso a API falhe
        loadMockData();
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar dados simulados caso a API falhe
  const loadMockData = () => {
    const mockComponents = [
      { 
        idComponente: 1, 
        idHardWareTech: 'IDH001', 
        partNumber: 'PN12345', 
        quantidade: 10, 
        flagML: true, 
        flagVerificado: true,
        condicao: 'Bom Estado',
        descricao: 'Processador Intel Core i7 de 10ª geração',
        fkCaixa: { nomeCaixa: 'Caixa A' },
        isVisibleCatalog: true
      },
      { 
        idComponente: 2, 
        idHardWareTech: 'IDH002', 
        partNumber: 'PN54321', 
        quantidade: 5, 
        flagML: false, 
        flagVerificado: true,
        condicao: 'Observação',
        observacao: 'Alguns pinos danificados',
        descricao: '',
        fkCaixa: { nomeCaixa: 'Caixa B' },
        isVisibleCatalog: false
      },
      { 
        idComponente: 3, 
        idHardWareTech: 'IDH003', 
        partNumber: 'PN67890', 
        quantidade: 15, 
        flagML: true, 
        flagVerificado: false,
        descricao: 'Placa de vídeo GeForce RTX 3060',
        fkCaixa: { nomeCaixa: 'Caixa A' },
        isVisibleCatalog: true
      }
    ];
    
    setComponents(mockComponents);
    setFilteredComponents(mockComponents);
    setTotalComponents(mockComponents.length);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    
    if (value.trim() === '') {
      setFilteredComponents(components);
    } else {
      const filtered = components.filter(item => 
        (item.partNumber && item.partNumber.toLowerCase().includes(value.toLowerCase())) ||
        (item.descricao && item.descricao.toLowerCase().includes(value.toLowerCase())) ||
        (item.idHardWareTech && item.idHardWareTech.toString().includes(value.toLowerCase())) ||
        (item.nomeComponente && item.nomeComponente.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredComponents(filtered);
    }
    setPage(0);
  };

  // Atualiza o fetchAvailableCaixas quando os componentes são carregados
  useEffect(() => {
    fetchAvailableCaixas();
  }, [components]);

  // Função para filtrar componentes com base em filtros e texto de busca
  useEffect(() => {
    const filtered = components.filter(
      (item) => {
        // Filtro de texto de busca
        const matchesSearch = 
          (item.partNumber && item.partNumber.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.descricao && item.descricao.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.idHardWareTech && item.idHardWareTech.toString().includes(searchText.toLowerCase())) ||
          (item.nomeComponente && item.nomeComponente.toLowerCase().includes(searchText.toLowerCase()));
        
        // Filtro por caixa
        const matchesCaixa = activeFilters.caixas.length === 0 || 
          (item.fkCaixa && activeFilters.caixas.includes(item.fkCaixa.nomeCaixa));
        
        // Filtro por mercado livre
        const matchesMercadoLivre = activeFilters.mercadoLivre === null || 
          item.flagML === activeFilters.mercadoLivre;
        
        // Filtro por verificado
        const matchesVerificado = activeFilters.verificado === null || 
          item.flagVerificado === activeFilters.verificado;
        
        // Filtro por condição (só se aplica se verificado for true)
        let matchesCondicao = true;
        if (item.flagVerificado && activeFilters.condicao.length > 0) {
          const condicaoFormatada = item.condicao ? item.condicao.toLowerCase() : '';
          
          // Verifica se a condição do item corresponde a algum dos filtros selecionados
          matchesCondicao = (
            (activeFilters.condicao.includes('Bom Estado') && 
              (condicaoFormatada === 'bom_estado' || condicaoFormatada === 'bomestado')) ||
            (activeFilters.condicao.includes('Observação') && 
              (condicaoFormatada === 'em_observacao' || condicaoFormatada === 'emobservacao' || 
               condicaoFormatada === 'observacao' || condicaoFormatada === 'observação'))
          );
        }
        
        return matchesSearch && matchesCaixa && matchesMercadoLivre && matchesVerificado && matchesCondicao;
      }
    );
    
    setFilteredComponents(filtered);
  }, [components, searchText, activeFilters]);

  const handleEditComponent = (component) => {
    setComponentToEdit(component);
    setModalOpen(true);
  };

  const handleAddComponent = () => {
    setComponentToEdit(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    fetchComponents();
  };

  const handleDeleteComponent = (component) => {
    setComponentToDelete(component);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setComponentToDelete(null);
    fetchComponents();
  };

  // Função para lidar com o início do processo de toggle de visibilidade
  const handleToggleCatalog = (componentId, newVisibility) => {
    // Encontra o componente pelo ID
    const component = components.find(c => c.idComponente === componentId);
    if (component) {
      setComponentToToggleVisibility(component);
      setNewVisibilityValue(newVisibility);
      setVisibilityModalOpen(true);
    }
  };

  // Função para confirmar e realizar a alteração de visibilidade
  const handleConfirmVisibilityChange = async () => {
    if (!componentToToggleVisibility) return;
    
    try {
      setToggleVisibilityLoading(true);
      
      const componentId = componentToToggleVisibility.idComponente;
      
      await api.patch(`/components/${componentId}/visibility`, {
        isVisibleCatalog: newVisibilityValue
      });
      
      const updatedComponents = components.map(comp => {
        if (comp.idComponente === componentId) {
          return { ...comp, isVisibleCatalog: newVisibilityValue };
        }
        return comp;
      });
      
      setComponents(updatedComponents);
      setVisibilityModalOpen(false);
      setComponentToToggleVisibility(null);
      
      // Recarregar os dados do servidor
      fetchComponents();
      
    } catch (error) {
      console.error("Erro ao alterar visibilidade no catálogo:", error);
    } finally {
      setToggleVisibilityLoading(false);
    }
  };
  
  // Cards de estatísticas para o DatagridHeader
  const statsCards = [
    {
      icon: <InventoryIcon fontSize="small" sx={{ color: '#61131A' }} />,
      value: totalComponents,
      label: 'Total de Componentes',
      color: '#61131A',
      iconBgColor: '#ffeded'
    },
    {
      icon: <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#27ae60' }} />,
      value: components.filter(c => c.flagVerificado).length,
      label: 'Verificados',
      color: '#27ae60',
      iconBgColor: 'rgba(46, 204, 113, 0.1)'
    },
    {
      icon: <StorefrontIcon fontSize="small" sx={{ color: '#2980b9' }} />,
      value: components.filter(item => item.flagML).length,
      label: 'Anunciados',
      color: '#2980b9',
      iconBgColor: 'rgba(41, 128, 185, 0.1)'
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
      <DatagridHeader
        title="Adicionar componente"
        searchPlaceholder="Buscar por part number, IDH ou descrição..."
        searchProps={{
          value: searchText,
          onChange: handleSearchChange
        }}
        onAddClick={handleAddComponent}
        activeFilterCount={Object.values(activeFilters).flat().filter(Boolean).length}
        onFilterClick={handleOpenFilterMenu}
        statsCards={statsCards}
        data={filteredComponents}
        exportHeaders={exportHeaders}
        exportFilename="componentes_hardwaretech"
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
        {/* DataGrid com os componentes */}
        <ComponentesDataGrid 
          components={components}
          filteredComponents={filteredComponents}
          page={page}
          rowsPerPage={rowsPerPage}
          defaultImage={defaultImage}
          onEditComponent={handleEditComponent}
          onDeleteComponent={handleDeleteComponent}
          onToggleCatalog={handleToggleCatalog}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          loading={loading}
        />
      </Container>

      {/* Modal do formulário de componente */}
      <ComponentFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        componentToEdit={componentToEdit}
        componentes={components}
      />

      {/* Modal de deleção de componente */}
      <ComponentDeleteModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        component={componentToDelete}
        onComponentDeleted={handleCloseDeleteModal}
      />

      {/* Modal de visibilidade do catálogo */}
      <CatalogVisibilityModal
        open={visibilityModalOpen}
        onClose={() => setVisibilityModalOpen(false)}
        component={componentToToggleVisibility}
        newVisibility={newVisibilityValue}
        onConfirm={handleConfirmVisibilityChange}
        isLoading={toggleVisibilityLoading}
      />

      {/* Menu de filtros */}
      <ComponentesFilter
        anchorEl={filterMenuAnchor}
        onClose={handleCloseFilterMenu}
        availableCaixas={availableCaixas}
        activeFilters={activeFilters}
        toggleCaixaFilter={toggleCaixaFilter}
        toggleMercadoLivreFilter={toggleMercadoLivreFilter}
        toggleVerificadoFilter={toggleVerificadoFilter}
        toggleCondicaoFilter={toggleCondicaoFilter}
        clearAllFilters={clearAllFilters}
      />
    </div>
  );
};

export default Componentes;
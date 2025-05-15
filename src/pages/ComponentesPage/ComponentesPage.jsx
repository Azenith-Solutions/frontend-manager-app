import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import ComponentesDataGrid from '../../components/datagrids/ComponentesDataGrid/ComponentesDataGrid';
import DatagridHeader from '../../components/headerDataGrids/DatagridHeader';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ComponentesPage = () => {
  // Estados para a página
  const [components, setComponents] = useState([]); 
  const [filteredComponents, setFilteredComponents] = useState([]); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [componentesSemDescricao, setComponentesSemDescricao] = useState(0);

  // Efeito para carregar os componentes (simulado)
  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        // Aqui você faria sua chamada API
        // Simulando dados para exemplo
        const mockComponents = [
          { 
            idComponente: 1, 
            idHardWareTech: 'IDH001', 
            partNumber: 'PN12345', 
            quantidade: 10, 
            flagML: true, 
            flagVerificado: true,
            condicao: 'Bom Estado',
            descricao: 'Processador Intel Core i7 de 10ª geração'
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
            descricao: '' // Este não tem descrição
          },
          // ... mais componentes ...
        ];
        
        setComponents(mockComponents);
        setFilteredComponents(mockComponents);
      } catch (error) {
        console.error('Erro ao buscar componentes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComponents();
  }, []);

  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
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
        item.partNumber.toLowerCase().includes(value.toLowerCase()) ||
        item.idHardWareTech.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredComponents(filtered);
    }
    setPage(0);
  };

  const handleSemDescricaoCount = (count) => {
    setComponentesSemDescricao(count);
  };

  // Stats para o header
  const statsCards = [
    {
      icon: <InventoryIcon fontSize="small" sx={{ color: '#61131A' }} />,
      value: components.length,
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
      icon: <WarningIcon fontSize="small" sx={{ color: '#e74c3c' }} />,
      value: componentesSemDescricao,
      label: 'Sem Descrição',
      color: '#e74c3c',
      iconBgColor: 'rgba(231, 76, 60, 0.1)'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ pt: 2 }}>
      <Box sx={{ mb: 4 }}>
        {/* Header com o alerta de componentes sem descrição */}
        <DatagridHeader
          title="Adicionar Componente"
          searchPlaceholder="Buscar por part number ou IDH..."
          searchProps={{
            value: searchText,
            onChange: handleSearchChange
          }}
          onAddClick={() => console.log('Adicionar novo componente')}
          activeFilterCount={Object.keys(activeFilters).length}
          onFilterClick={() => console.log('Abrir filtros')}
          statsCards={statsCards}
          componentesSemDescricao={componentesSemDescricao}
        />
        
        {/* DataGrid com os componentes */}
        <ComponentesDataGrid
          components={components}
          filteredComponents={filteredComponents}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEditComponent={(item) => console.log('Editar componente', item)}
          onDeleteComponent={(item) => console.log('Excluir componente', item)}
          defaultImage="/placeholder-component.png"
          loading={loading}
          onSemDescricaoCount={handleSemDescricaoCount}
        />
      </Box>
    </Container>
  );
};

export default ComponentesPage;

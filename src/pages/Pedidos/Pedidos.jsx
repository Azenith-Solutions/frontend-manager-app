import React, { useEffect, useState } from "react";
import styles from "./Pedido.module.css";
import { api } from "../../service/api";

// Componentes genéricos para header e filtro
import DatagridHeader from "../../components/headerDataGrids/DatagridHeader";
import PedidosFilter from "../../components/menuFilter/PedidosFilter";

// Material UI Components
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  IconButton,
} from "@mui/material";

// Material UI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Pedidos = () => {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalPedidos, setTotalPedidos] = useState(0);

  // Estado para controlar o menu de filtros
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [availableClientes, setAvailableClientes] = useState([]);

  // Estado para filtros ativos
  const [activeFilters, setActiveFilters] = useState({
    status: [],
    aprovado: null,
    periodo: null,
    clientes: []
  });

  useEffect(() => {
    document.title = "HardwareTech | Pedidos";
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);

      // Adicionando um delay artificial para mostrar a tela de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dados de exemplo para pedidos
      const mockPedidos = [
        { id: 1, idSolicitacao: 'SOL-001', cnpjCpf: '12.345.678/0001-90', aprovado: true, dataPedido: '01/05/2025', valor: 1250.99, status: 'Aprovado' },
        { id: 2, idSolicitacao: 'SOL-002', cnpjCpf: '98.765.432/0001-21', aprovado: false, dataPedido: '28/04/2025', valor: 750.50, status: 'Pendente' },
        { id: 3, idSolicitacao: 'SOL-003', cnpjCpf: '45.678.901/0001-23', aprovado: true, dataPedido: '25/04/2025', valor: 3200.00, status: 'Aprovado' },
        { id: 4, idSolicitacao: 'SOL-004', cnpjCpf: '789.456.123-45', aprovado: true, dataPedido: '20/04/2025', valor: 899.90, status: 'Entregue' },
        { id: 5, idSolicitacao: 'SOL-005', cnpjCpf: '34.567.890/0001-12', aprovado: false, dataPedido: '15/04/2025', valor: 1599.99, status: 'Cancelado' },
        { id: 6, idSolicitacao: 'SOL-006', cnpjCpf: '23.456.789/0001-34', aprovado: true, dataPedido: '10/04/2025', valor: 2399.00, status: 'Aprovado' },
        { id: 7, idSolicitacao: 'SOL-007', cnpjCpf: '56.789.012/0001-45', aprovado: true, dataPedido: '05/04/2025', valor: 4500.00, status: 'Entregue' },
        { id: 8, idSolicitacao: 'SOL-008', cnpjCpf: '67.890.123/0001-56', aprovado: false, dataPedido: '01/04/2025', valor: 799.90, status: 'Pendente' }
      ];

      setPedidos(mockPedidos);
      setTotalPedidos(mockPedidos.length);

      // Extrair clientes únicos para filtro
      const clientes = [...new Set(mockPedidos.map(p => p.cnpjCpf))].map(cnpjCpf => {
        return { id: cnpjCpf, cnpjCpf };
      });
      setAvailableClientes(clientes);

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

  // Manipuladores de filtros para Pedidos
  const toggleStatusFilter = (status) => {
    setActiveFilters(prev => {
      const updatedStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];

      return { ...prev, status: updatedStatus };
    });
    setPage(0);
  };

  const toggleAprovadoFilter = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      aprovado: prev.aprovado === value ? null : value
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

  const toggleClienteFilter = (clienteId) => {
    setActiveFilters(prev => {
      const updatedClientes = prev.clientes.includes(clienteId)
        ? prev.clientes.filter(c => c !== clienteId)
        : [...prev.clientes, clienteId];

      return { ...prev, clientes: updatedClientes };
    });
    setPage(0);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      status: [],
      aprovado: null,
      periodo: null,
      clientes: []
    });
    setPage(0);
  };

  // Contagem de filtros ativos
  const activeFilterCount = [
    activeFilters.status.length > 0,
    activeFilters.aprovado !== null,
    activeFilters.periodo !== null,
    activeFilters.clientes.length > 0
  ].filter(Boolean).length;

  // Filtrar os pedidos baseado nos filtros aplicados
  const filteredPedidos = pedidos.filter(
    (item) => {
      // Filtro de busca/texto
      const matchesSearch =
        item.idSolicitacao.toLowerCase().includes(searchText.toLowerCase()) ||
        item.cnpjCpf.toLowerCase().includes(searchText.toLowerCase()) ||
        item.dataPedido.includes(searchText);

      // Filtro por status
      const matchesStatus = activeFilters.status.length === 0 ||
        activeFilters.status.includes(item.status);

      // Filtro por aprovado
      const matchesAprovado = activeFilters.aprovado === null ||
        item.aprovado === activeFilters.aprovado;

      // Filtro por cliente
      const matchesCliente = activeFilters.clientes.length === 0 ||
        activeFilters.clientes.includes(item.cnpjCpf);

      // Filtro por período (simplificado, em produção usaria datas reais)
      const matchesPeriodo = activeFilters.periodo === null || true; // Simplificação

      return matchesSearch && matchesStatus && matchesAprovado && matchesCliente && matchesPeriodo;
    }
  );

  // Função para abrir formulário de novo pedido
  const handleAddPedido = () => {
    console.log("Abrir formulário para novo pedido");
    // Implementar a abertura do modal de formulário no futuro
  };

  // Cartões de estatísticas para o header
  const statsCards = [
    {
      icon: <ReceiptIcon sx={{ color: '#61131A', fontSize: 14 }} />,
      iconBgColor: '#ffeded',
      color: '#61131A',
      value: totalPedidos,
      label: 'Pedidos'
    },
    {
      icon: <ShoppingCartIcon sx={{ color: '#27ae60', fontSize: 14 }} />,
      iconBgColor: '#eaf7ef',
      color: '#27ae60',
      value: pedidos.filter(item => item.aprovado).length,
      label: 'Aprovados'
    }
  ];

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dados de pedidos...
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.pedidos}>
      {/* Utilizando o componente DatagridHeader genérico */}
      <DatagridHeader
        title="Novo Pedido"
        searchPlaceholder="Buscar pedido..."
        searchProps={{
          value: searchText,
          onChange: handleSearchChange
        }}
        onAddClick={handleAddPedido}
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
            <Table stickyHeader sx={{ width: '100%' }} aria-label="tabela de pedidos">
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
                  <TableCell align="center">ID Solicitação</TableCell>
                  <TableCell align="center">CNPJ/CPF</TableCell>
                  <TableCell align="center">Aprovado</TableCell>
                  <TableCell align="center">Data Pedido</TableCell>
                  <TableCell align="center">Valor</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPedidos
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
                      <TableCell align="center" sx={{ fontWeight: 'medium', py: 0.8 }}>{item.idSolicitacao}</TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 'medium', py: 0.8 }}>{item.cnpjCpf}</TableCell>
                      <TableCell align="center" sx={{ py: 0.8 }}>
                        <Chip
                          icon={item.aprovado ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                          label={item.aprovado ? "Sim" : "Não"}
                          size="small"
                          sx={{
                            backgroundColor: item.aprovado ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                            color: item.aprovado ? '#27ae60' : '#e74c3c',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            borderRadius: '4px',
                            '& .MuiChip-icon': { color: 'inherit' }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 0.8 }}>{item.dataPedido}</TableCell>
                      <TableCell align="center" sx={{ py: 0.8 }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 0.8 }}>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              item.status === 'Aprovado' ? 'rgba(46, 204, 113, 0.1)' :
                                item.status === 'Pendente' ? 'rgba(241, 196, 15, 0.1)' :
                                  item.status === 'Entregue' ? 'rgba(52, 152, 219, 0.1)' :
                                    'rgba(231, 76, 60, 0.1)',
                            color:
                              item.status === 'Aprovado' ? '#27ae60' :
                                item.status === 'Pendente' ? '#f39c12' :
                                  item.status === 'Entregue' ? '#3498db' :
                                    '#e74c3c',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            borderRadius: '4px'
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
                {filteredPedidos.length > 0 &&
                  filteredPedidos.length < rowsPerPage &&
                  Array.from({ length: Math.max(0, rowsPerPage - filteredPedidos.length) }).map((_, index) => (
                    <TableRow key={`empty-${index}`} sx={{ height: '50px' }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  ))}
                {filteredPedidos.length === 0 && (
                  <TableRow sx={{ height: '53px' }}>
                    <TableCell colSpan={7} align="center">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={filteredPedidos.length}
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
      <PedidosFilter
        anchorEl={filterMenuAnchor}
        onClose={handleFilterMenuClose}
        activeFilters={activeFilters}
        toggleStatusFilter={toggleStatusFilter}
        toggleAprovadoFilter={toggleAprovadoFilter}
        togglePeriodoFilter={togglePeriodoFilter}
        toggleClienteFilter={toggleClienteFilter}
        availableClientes={availableClientes}
        clearAllFilters={clearAllFilters}
      />
    </div>
  );
};

export default Pedidos;

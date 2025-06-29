import React, { useEffect, useState } from "react";
import styles from "./Pedido.module.css";
import { api } from "../../service/api";
import OrderFormModal from "../../components/forms/OrderFormModal/OrderFormModal";
import DatagridHeader from "../../components/headerDataGrids/DatagridHeader";
import PedidosFilter from "../../components/menuFilter/PedidosFilter";

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
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

const Pedidos = () => {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [pedidoToEdit, setPedidoToEdit] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    status: [],
    aprovado: null,
    periodo: null,
    clientes: []
  });
  const [itensModalOpen, setItensModalOpen] = useState(false);
  const [pedidoItens, setPedidoItens] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [debugItensApi, setDebugItensApi] = useState([]);
  const [componentesEstoque, setComponentesEstoque] = useState([]);
  const [itensPorPedido, setItensPorPedido] = useState({});
  const [editBlockedModalOpen, setEditBlockedModalOpen] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  // Definição dos cabeçalhos para exportação
  const exportHeaders = [
    { id: 'idPedido', label: 'ID Pedido' },
    { id: 'cnpj', label: 'CNPJ/CPF' },
    { id: 'nome_comprador', label: 'Nome do Comprador' },
    { id: 'email_comprador', label: 'Email do Comprador' },
    { id: 'createdAt', label: 'Data do Pedido' },
    { id: 'valor', label: 'Valor Total' },
    { id: 'status', label: 'Status' }
  ];

  useEffect(() => {
    document.title = "HardwareTech | Pedidos";
    fetchPedidos();
    fetchComponentesEstoque();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);


      await new Promise(resolve => setTimeout(resolve, 1000));


      const response = await api.get('/orders');
      console.log('Resposta dos pedidos:', response);

      const responseData = response.data.data || response.data;

      if (Array.isArray(responseData)) {
        setPedidos(responseData);
        setTotalPedidos(responseData.length);
      } else {
        console.error('Dados recebidos não são um array:', responseData);
        setPedidos([]);
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComponentesEstoque = async () => {
    try {
      const response = await api.get('/components');
      const data = response.data.data || response.data;
      setComponentesEstoque(Array.isArray(data) ? data : []);
    } catch (error) {
      setComponentesEstoque([]);
    }
  };

  const fetchDelete = async (id) => {
    try {
      // Busca todos os itens vinculados ao pedido
      const itensResp = await api.get('/items');
      const itens = itensResp.data.data || itensResp.data || [];
      const itensDoPedido = itens.filter(item => item.fkPedido && String(item.fkPedido.idPedido) === String(id));
      // Deleta cada item individualmente
      for (const item of itensDoPedido) {
        await api.delete(`/items/${item.idItem || item.id}`);
      }
      // Agora deleta o pedido
      await api.delete(`/orders/${id}`);
      fetchPedidos();
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
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

  const handleDeleteClick = (pedido) => {
    setPedidoToDelete(pedido);
    setDeleteDialogOpen(true);
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

  const handleConfirmDelete = async () => {
    if (pedidoToDelete) {
      await fetchDelete(pedidoToDelete.idPedido);
      setDeleteDialogOpen(false);
      setPedidoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPedidoToDelete(null);
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

  const filteredPedidos = pedidos.filter(
    (item) => {
      // Filtro de busca/texto
      const matchesSearch =
        (item.codigo && item.codigo.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.cnpj && item.cnpj.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.nome_comprador && item.nome_comprador.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.email_comprador && item.email_comprador.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(searchText.toLowerCase()));

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
    setOrderModalOpen(true);
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
      value: pedidos.filter(item => (item.status || '').toLowerCase() === 'concluido').length,
      label: 'Aprovados'
    }
  ];

  // Função para visualizar itens do pedido
  const handleVerItens = async (pedido) => {
    setPedidoSelecionado(pedido);
    setItensModalOpen(true);
    setPedidoItens([]);
    setDebugItensApi([]); // Limpa debug
    try {
      // Busca todos os itens e filtra pelo pedido selecionado
      const response = await api.get('/items');
      const itens = response.data.data || response.data || [];
      setDebugItensApi(itens); // Salva todos os itens para debug
      // Filtra os itens que pertencem ao pedido selecionado
      const id = pedido.idPedido || pedido.id_pedido || pedido.id;
      const itensPedido = itens.filter(item => {
        // fkPedido é um objeto, comparar pelo idPedido
        return item.fkPedido && String(item.fkPedido.idPedido) === String(id);
      });
      setPedidoItens(itensPedido);
    } catch (error) {
      setPedidoItens([]);
      setDebugItensApi([]);
    }
  };

  // Busca os itens dos pedidos visíveis na página
  useEffect(() => {
    const pedidosVisiveis = filteredPedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const idsParaBuscar = pedidosVisiveis
      .filter(p => !itensPorPedido[p.idPedido])
      .map(p => p.idPedido);
    if (idsParaBuscar.length === 0) return;
    const fetchItens = async () => {
      try {
        const response = await api.get('/items');
        const itens = response.data.data || response.data || [];
        const novoItensPorPedido = { ...itensPorPedido };
        idsParaBuscar.forEach(id => {
          novoItensPorPedido[id] = itens.filter(item => item.fkPedido && String(item.fkPedido.idPedido) === String(id));
        });
        setItensPorPedido(novoItensPorPedido);
      } catch (e) {
        // Em caso de erro, não faz nada
      }
    };
    fetchItens();
    // eslint-disable-next-line
  }, [filteredPedidos, page, rowsPerPage]);

  // Atualiza pedidos, componentes e itensPorPedido após salvar/editar pedido
  const handleOrderSuccess = async () => {
    await fetchPedidos();
    await fetchComponentesEstoque();
    // Atualiza itensPorPedido para todos os pedidos visíveis
    try {
      const response = await api.get('/items');
      const itens = response.data.data || response.data || [];
      const novoItensPorPedido = {};
      // Atualiza para todos os pedidos atualmente filtrados e visíveis
      filteredPedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach(p => {
        novoItensPorPedido[p.idPedido] = itens.filter(item => item.fkPedido && String(item.fkPedido.idPedido) === String(p.idPedido));
      });
      setItensPorPedido(prev => ({ ...prev, ...novoItensPorPedido }));
    } catch (e) {
      // Em caso de erro, não faz nada
    }
  };

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
        data={filteredPedidos}
        exportHeaders={exportHeaders}
        exportFilename="pedidos_hardwaretech"
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
                  <TableCell align="center">Data Pedido</TableCell>
                  <TableCell align="center">Valor</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPedidos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => {
                    const itensPedido = itensPorPedido[item.idPedido] || [];
                    let algumExcedeEstoque = false;
                    if (Array.isArray(itensPedido) && componentesEstoque.length > 0) {
                      algumExcedeEstoque = itensPedido.some(it => {
                        const compId = it.fkComponente?.idComponente || it.fk_componente || it.fkComponente;
                        const comp = componentesEstoque.find(c => String(c.idComponente) === String(compId));
                        const excede = comp && Number(it.quantidadeCarrinho) > Number(comp.quantidade);
                        return excede;
                      });
                    }
                    // NÃO mostrar warning se o pedido está concluído
                    const isConcluido = (item.status || '').toLowerCase() === 'concluido';
                    return (
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
                        <TableCell align="center" sx={{ fontWeight: 'medium', py: 0.8 }}>{item.idPedido}</TableCell>
                        <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 'medium', py: 0.8 }}>{formatCnpjCpf(item.cnpj) || ''}</TableCell>
                        <TableCell align="center" sx={{ py: 0.8 }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : ''}</TableCell>
                        <TableCell align="center" sx={{ py: 0.8 }}>
                          {item.valor !== undefined ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor) : ''}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 0.8, minWidth: 140 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minHeight: 28 }}>
                            <Chip
                              label={formatStatus(item.status)}
                              size="small"
                              sx={{
                                backgroundColor:
                                  item.status && item.status.toLowerCase() === 'concluido' ? 'rgba(46, 204, 113, 0.1)' :
                                    item.status && item.status.toLowerCase() === 'pendente' ? 'rgba(241, 196, 15, 0.1)' :
                                      item.status && item.status.toLowerCase() === 'em_andamento' ? 'rgba(52, 152, 219, 0.1)' :
                                        'rgba(231, 76, 60, 0.1)',
                                color:
                                  item.status && item.status.toLowerCase() === 'concluido' ? '#27ae60' :
                                    item.status && item.status.toLowerCase() === 'pendente' ? '#f39c12' :
                                      item.status && item.status.toLowerCase() === 'em_andamento' ? '#3498db' :
                                        '#e74c3c',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                borderRadius: '4px'
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 0.8 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                            {algumExcedeEstoque && !isConcluido ? (
                              <Tooltip
                                title={<Typography variant="body2" sx={{ p: 1 }}>Quantidade solicitada excede o estoque atual do componente!</Typography>}
                                arrow
                                placement="top"
                              >
                                <IconButton size="small" sx={{ p: 0.3, ml: 0.2, color: '#e74c3c' }}>
                                  <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Box sx={{ width: 22, height: 22, mr: 0.5 }} />
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{
                                color: '#27ae60',
                                borderColor: '#27ae60',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                px: 1.5,
                                py: 0.5,
                                minWidth: '80px',
                                '&:hover': {
                                  backgroundColor: 'rgba(39, 174, 96, 0.08)',
                                  borderColor: '#219150',
                                },
                              }}
                              onClick={() => handleVerItens(item)}
                            >
                              Ver Itens
                            </Button>
                            <IconButton
                              size="small"
                              title="Editar"
                              sx={{
                                color: '#2980b9',
                                backgroundColor: 'rgba(41, 128, 185, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(41, 128, 185, 0.2)' }
                              }}
                              onClick={() => {
                                if ((item.status || '').toLowerCase() === 'concluido') {
                                  setEditBlockedModalOpen(true);
                                } else {
                                  setPedidoToEdit(item);
                                  setOrderModalOpen(true);
                                }
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
                              onClick={() => handleDeleteClick(item)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      <OrderFormModal
        open={orderModalOpen}
        onClose={() => {
          setOrderModalOpen(false);
          setPedidoToEdit(null);
        }}
        onSuccess={handleOrderSuccess}
        pedido={pedidoToEdit}
      />

      {/* Componente PedidosFilter */}
      <PedidosFilter
        anchorEl={filterMenuAnchor}
        onClose={handleFilterMenuClose}
        activeFilters={activeFilters}
        toggleStatusFilter={toggleStatusFilter}
        toggleAprovadoFilter={toggleAprovadoFilter}
        togglePeriodoFilter={togglePeriodoFilter}
        toggleClienteFilter={toggleClienteFilter}
        clearAllFilters={clearAllFilters}
      />

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: '1.2rem', pb: 0 }}>
          Confirmar exclusão
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 0 }}>
          <Typography sx={{ fontSize: '1rem', color: '#333', fontWeight: 500 }}>
            Tem certeza que deseja excluir este pedido?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3, pl: 3 }}>
          <Button onClick={handleCancelDelete} sx={{ borderRadius: '4px', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ bgcolor: '#61131A', '&:hover': { bgcolor: '#4e0f15' }, fontWeight: 600, borderRadius: '4px', textTransform: 'none' }}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de itens do pedido */}
      <Dialog open={itensModalOpen} onClose={() => setItensModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          background: 'linear-gradient(90deg, #f8fafc 60%, #f0f2f5 100%)',
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#61131A',
          py: 2,
        }}>
          <ReceiptIcon sx={{ color: '#61131A', fontSize: 28, mr: 1 }} />
          Itens do Pedido {pedidoSelecionado?.idPedido}
        </DialogTitle>
        <DialogContent sx={{
          background: 'linear-gradient(90deg, #f8fafc 60%, #f0f2f5 100%)',
          px: 3,
          py: 2.5,
        }}>
          {pedidoItens.length === 0 ? (
            <Typography sx={{ color: '#888', mt: 2, textAlign: 'center', fontSize: '1.05rem' }}>Nenhum item encontrado.</Typography>
          ) : (
            <Table size="small" sx={{
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(97,19,26,0.06)',
              overflow: 'hidden',
              mt: 1,
            }}>
              <TableHead>
                <TableRow sx={{ background: '#f5e9eb' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#61131A', fontSize: '1rem', borderBottom: '2px solid #61131A' }}>Componente</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#61131A', fontSize: '1rem', borderBottom: '2px solid #61131A' }}>Quantidade Solicitada</TableCell>
                  {/* Só mostra a coluna de estoque se o pedido NÃO estiver concluído */}
                  {pedidoSelecionado?.status?.toLowerCase() !== 'concluido' && (
                    <TableCell sx={{ fontWeight: 700, color: '#61131A', fontSize: '1rem', borderBottom: '2px solid #61131A' }}>Quantidade em Estoque</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidoItens.map((item, idx) => (
                  <TableRow key={idx} sx={{
                    background: idx % 2 === 0 ? '#f8fafc' : '#fff',
                    '&:last-child td': { borderBottom: 0 },
                  }}>
                    <TableCell sx={{ fontWeight: 500, color: '#333', fontSize: '0.98rem' }}>{item.fkComponente?.partNumber || item.fkComponente?.idComponente || item.fkComponente?.descricao || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#61131A', fontSize: '0.98rem' }}>{item.quantidadeCarrinho}</TableCell>
                    {/* Só mostra a quantidade em estoque se o pedido NÃO estiver concluído */}
                    {pedidoSelecionado?.status?.toLowerCase() !== 'concluido' && (
                      <TableCell sx={{ fontWeight: 500, color: '#61131A', fontSize: '0.98rem' }}>{item.fkComponente?.quantidade ?? '-'}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions sx={{
          background: '#f8fafc',
          borderTop: '1px solid #e0e0e0',
          py: 2,
          px: 3,
          justifyContent: 'center',
        }}>
          <Button onClick={() => setItensModalOpen(false)} sx={{
            borderRadius: '4px',
            textTransform: 'none',
            fontWeight: 700,
            px: 4,
            bgcolor: '#61131A',
            color: '#fff',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(97,19,26,0.08)',
            '&:hover': { bgcolor: '#4e0f15' }
          }}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edição bloqueada */}
      <Dialog open={editBlockedModalOpen} onClose={() => setEditBlockedModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: '1.2rem', pb: 0, textAlign: 'center', background: '#fff', borderBottom: '1px solid #f8d7da' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <InfoOutlinedIcon sx={{ color: '#61131A', fontSize: 38, mb: 0.5 }} />
            Edição não permitida
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 2, background: '#fff' }}>
          <Typography sx={{ fontSize: '1.05rem', color: '#61131A', fontWeight: 600, textAlign: 'center', mb: 1 }}>
            Não é possível editar um pedido que já está <b>CONCLUÍDO</b>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3, pl: 3, justifyContent: 'center', background: '#fff' }}>
          <Button onClick={() => setEditBlockedModalOpen(false)} sx={{ borderRadius: '4px', textTransform: 'none', fontWeight: 600, px: 4, bgcolor: '#61131A', color: '#fff', '&:hover': { bgcolor: '#4e0f15' } }} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Função utilitária para formatar CNPJ ou CPF
function formatCnpjCpf(value) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  } else if (digits.length === 11) {
    // CPF: 000.000.000-00
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
}

// Função utilitária para formatar status
function formatStatus(status) {
  if (!status) return '';
  const map = {
    'concluido': 'CONCLUÍDO',
    'pendente': 'PENDENTE',
    'em_andamento': 'EM ANDAMENTO'
  };
  const lower = status.toLowerCase();
  if (map[lower]) return map[lower];
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default Pedidos;

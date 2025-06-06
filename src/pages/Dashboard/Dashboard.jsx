import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@mui/material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';
import styles from "./Dashboard.module.css";
import {
  fetchLowStockItems,
  fetchInObservationItems,
  fetchIcompleteItems,
  fetchItemsOutOfLastSaleSLA,
  fetchQuantityByMLStatus,
  fetchComponentsPerBox
} from "../../service/dashboard/dashboardService";
import KpiDetailModal from "../../components/modals/KpiDetailModal/KpiDetailModal";
import ComponentsPerBoxChart from './ComponentsPerBoxChart';

const Dashboard = () => {
  // Estados das KPIs
  const [lowStockComponents, setLowStockComponents] = useState([]);
  const [quantityLowStockComponents, setQuantityLowStockComponents] = useState(lowStockComponents.length);
  const [inObservationComponents, setInObservationComponents] = useState([]);
  const [quantityInObservationComponents, setQuantityInObservationComponents] = useState(inObservationComponents.length);
  const [incompleteComponents, setIncompleteComponents] = useState([]);
  const [quantityIncompleteComponents, setQuantityIncompleteComponents] = useState(incompleteComponents.length);
  const [itemsOutOfLastSaleSLA, setItemsOutOfLastSaleSLA] = useState([]);
  const [quantityItemsOutOfLastSaleSLA, setQuantityItemsOutOfLastSaleSLA] = useState(itemsOutOfLastSaleSLA.length);

  // Estados para dados dos gráficos
  const [componentsMLData, setComponentsMLData] = useState([]);
  const [boxesDataDashboard, setBoxesDataDashboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para controle de modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalColumns, setModalColumns] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Media queries para responsividade
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const chartCard1Ref = useRef(null);
  const chartCard3Ref = useRef(null);
  const [chartHeights, setChartHeights] = useState({
    chart1: isTablet ? 300 : 400,
    chart3: isTablet ? 300 : 400
  });

  const getLowStockComponents = async () => {
    try {
      const response = await fetchLowStockItems();
      const lowStockItems = response.data;

      setLowStockComponents(lowStockItems);
      setQuantityLowStockComponents(lowStockItems.length);
    } catch (error) {
      console.error("Erro ao buscar componentes com baixo estoque:", error);
    }
  };

  const getInObservationComponents = async () => {
    try {
      const response = await fetchInObservationItems();

      setInObservationComponents(response.data);
      setQuantityInObservationComponents(response.data.length);
    } catch (error) {
      console.error("Erro ao buscar componentes em observação:", error);
    }
  };

  const getIncompleteComponents = async () => {
    try {
      const response = await fetchIcompleteItems();

      setIncompleteComponents(response.data);
      setQuantityIncompleteComponents(response.data.length);
    } catch (error) {
      console.error("Erro ao buscar componentes incompletos:", error);
    }
  };
  const getItemsOutOfLastSaleSLA = async () => {
    try {
      const response = await fetchItemsOutOfLastSaleSLA();

      setItemsOutOfLastSaleSLA(response.data);
      setQuantityItemsOutOfLastSaleSLA(response.data.length);
    } catch (error) {
      console.error("Erro ao buscar itens fora do SLA da última venda:", error);
    }
  };

  const getQuantityByMLStatus = async () => {
    try {
      const response = await fetchQuantityByMLStatus();

      // Atualizando o estado de componentsMLData para uso no gráfico
      const mlData = [
        {
          name: 'Anunciados no ML',
          value: response.data[0] || 0,
          color: '#689F38'
        },
        {
          name: 'Não anunciados',
          value: response.data[1] || 0,
          color: '#61131A'
        },
      ];

      setComponentsMLData(mlData);
    } catch (error) {
      console.error("Erro ao buscar dados de componentes anunciados no ML:", error);

      const fallbackData = [
        { name: 'Anunciados no ML', value: 0, color: '#61131A' },
        { name: 'Não anunciados', value: 0, color: '#689F38' },
      ];
      setComponentsMLData(fallbackData);
    }
  };

  // Função para abrir o modal com detalhes da KPI selecionada
  const handleKpiClick = (kpiType) => {
    setModalLoading(true);
    setModalOpen(true);

    let modalColumns = [];

    switch (kpiType) {
      case 'lowStock':
        setModalTitle("Produtos com Baixo Estoque");
        setModalData(lowStockComponents);

        modalColumns = [
          { field: 'idHardWareTech', headerName: 'ID', width: 100 },
          { field: 'descricao', headerName: 'Descrição', width: 250 },
          { field: 'partNumber', headerName: 'Part Number', width: 150 },
          { field: 'quantidade', headerName: 'Qtde', width: 80 },
          {
            field: 'condicao',
            headerName: 'Condição',
            width: 130,
            renderCell: (value) => value?.descricao || value
          },
          {
            field: 'fkCaixa',
            headerName: 'Caixa',
            width: 120,
            valueGetter: (row) => row.fkCaixa?.nomeCaixa || '-'
          }];
        break;

      case 'observation':
        setModalTitle("Produtos em Observação");
        setModalData(inObservationComponents);

        modalColumns = [
          { field: 'idHardWareTech', headerName: 'IDH', width: 100 },
          { field: 'partNumber', headerName: 'Part Number', width: 150 },
          { field: 'observacao', headerName: 'Descrição', width: 250 },
          { field: 'descricao', headerName: 'Observação', width: 300 }
        ];
        break;
      case 'incomplete':
        setModalTitle("Produtos Incompletos");
        setModalData(incompleteComponents);

        modalColumns = [
          { field: 'idHardWareTech', headerName: 'ID', width: 100 },
          { field: 'descricao', headerName: 'Descrição', width: 250 },
          { field: 'partNumber', headerName: 'Part Number', width: 150 },
          { field: 'quantidade', headerName: 'Qtde', width: 80 },
          {
            field: 'condicao',
            headerName: 'Condição',
            width: 130,
            renderCell: (value) => value?.descricao || value
          },
          {
            field: 'fkCaixa',
            headerName: 'Caixa',
            width: 120,
            valueGetter: (row) => row.fkCaixa?.nomeCaixa || '-'
          }
        ];
        break;
      case 'outOfSla':
        setModalTitle("Produtos Não Vendidos por 30+ Dias");
        setModalData(itemsOutOfLastSaleSLA);

        modalColumns = [
          { field: 'idHardWareTech', headerName: 'ID', width: 100 },
          { field: 'descricao', headerName: 'Descrição', width: 250 },
          { field: 'partNumber', headerName: 'Part Number', width: 150 },
          { field: 'quantidade', headerName: 'Qtde', width: 80 },
          {
            field: 'condicao',
            headerName: 'Condição',
            width: 130,
            renderCell: (value) => value?.descricao || value
          },
          {
            field: 'fkCaixa',
            headerName: 'Caixa',
            width: 120,
            valueGetter: (row) => row.fkCaixa?.nomeCaixa || '-'
          }
        ];
        break;
      default:
        setModalTitle("Detalhes");
        setModalData([]);

        modalColumns = [
          { field: 'idHardWareTech', headerName: 'ID', width: 100 },
          { field: 'descricao', headerName: 'Descrição', width: 250 },
        ];
    }

    // Definindo as colunas no estado para uso no modal
    setModalColumns(modalColumns);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const setupKPIsAndDashboardsData = async () => {
    try {
      getLowStockComponents();
      getInObservationComponents();
      getIncompleteComponents();
      getItemsOutOfLastSaleSLA();
      getQuantityByMLStatus();
      getComponentsPerBox();
    } catch (error) {
      console.error("Erro ao buscar dados de KPIs e Dashboards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "HardwareTech | Dashboard";
    setupKPIsAndDashboardsData();
  }, []);
  // Ajusta alturas dos gráficos com base no redimensionamento da janela
  useEffect(() => {
    const handleResize = () => {
      if (chartCard1Ref.current && chartCard3Ref.current) {
        // Obtém a altura real do conteúdo do card e ajusta a altura do gráfico de acordo
        // Aumenta a subtração da altura do título para considerar títulos com quebra de linha
        const titleHeight = isTablet ? 50 : 60;
        const card1Height = chartCard1Ref.current.clientHeight - titleHeight;
        const card3Height = chartCard3Ref.current.clientHeight - titleHeight;

        setChartHeights({
          chart1: Math.max(card1Height, isTablet ? 250 : 300),
          chart3: Math.max(card3Height, isTablet ? 250 : 300)
        });
      }
    };    // Redimensionamento inicial e pequeno atraso para garantir atualizações do DOM
    setTimeout(handleResize, 100);

    // Adiciona listener de redimensionamento
    window.addEventListener('resize', handleResize);    // Configuração para o gráfico de pizza (componentes ML)
    // Adiciona listener de zoom para mudanças no zoom do navegador
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        setTimeout(handleResize, 100);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleResize);
    };
  }, [isTablet]);

  const getComponentsPerBox = async () => {
    try {
      const response = await fetchComponentsPerBox(); const boxes = [
        {
          title: response.data[0]?.name || 'Caixa 1',
          componentsPerBox: response.data[0]?.componentCount || 0
        },
        {
          title: response.data[1]?.name || 'Caixa 2',
          componentsPerBox: response.data[1]?.componentCount || 0
        },
        {
          title: response.data[2]?.name || 'Caixa 3',
          componentsPerBox: response.data[2]?.componentCount || 0
        },
        {
          title: response.data[3]?.name || 'Caixa 4',
          componentsPerBox: response.data[3]?.componentCount || 0
        },
        {
          title: response.data[4]?.name || 'Caixa 5',
          componentsPerBox: response.data[4]?.componentCount || 0
        }
      ];

      setBoxesDataDashboard(boxes);
    } catch (error) {
      console.error("Erro ao buscar dados das caixas:", error);
    }
  }

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress color="primary" size={50} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 500, color: '#555' }}>
          Carregando dados do dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Box className={styles.kpiContainer}>        <Card
        className={styles.kpiCard}
        sx={{
          borderTop: '4px solid #61131A',
          cursor: 'pointer',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #61131A 70%, rgba(97, 19, 26, 0.4) 100%)',
            borderRadius: '4px 4px 0 0',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover::after': {
            opacity: 1,
          }
        }}
        onClick={() => handleKpiClick('lowStock')}
      >
        <CardContent sx={{ p: 2 }}>
          <Box className={styles.kpiContent}>
            <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#ffeded' }}>
              <WarningIcon sx={{ color: '#61131A' }} />
            </Box>
            <Box className={styles.kpiDataBox}>
              <Typography variant="h4" className={styles.kpiValue}>
                {quantityLowStockComponents}
              </Typography>
              <Typography variant="body2" className={styles.kpiLabel}>
                Produtos com Baixo Estoque
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

        <Card
          className={styles.kpiCard}
          sx={{
            borderTop: '4px solid #0288d1',
            cursor: 'pointer',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #0288d1 70%, rgba(2, 136, 209, 0.4) 100%)',
              borderRadius: '4px 4px 0 0',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
            },
            '&:hover::after': {
              opacity: 1,
            }
          }}
          onClick={() => handleKpiClick('observation')}
        >
          <CardContent sx={{ p: 2 }}>
            <Box className={styles.kpiContent}>
              <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#e6f7ff' }}>
                <AttachMoneyIcon sx={{ color: '#0288d1' }} />
              </Box>
              <Box className={styles.kpiDataBox}>
                <Typography variant="h4" className={styles.kpiValue}>
                  {quantityInObservationComponents}
                </Typography>
                <Typography variant="body2" className={styles.kpiLabel}>
                  Em Observação
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          className={styles.kpiCard}
          sx={{
            borderTop: '4px solid #689f38',
            cursor: 'pointer',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #689f38 70%, rgba(104, 159, 56, 0.4) 100%)',
              borderRadius: '4px 4px 0 0',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
            },
            '&:hover::after': {
              opacity: 1,
            }
          }}
          onClick={() => handleKpiClick('incomplete')}
        >
          <CardContent sx={{ p: 2 }}>
            <Box className={styles.kpiContent}>
              <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#f0f7e6' }}>
                <AutorenewIcon sx={{ color: '#689f38' }} />
              </Box>
              <Box className={styles.kpiDataBox}>
                <Typography variant="h4" className={styles.kpiValue}>
                  {quantityIncompleteComponents}
                </Typography>
                <Typography variant="body2" className={styles.kpiLabel}>
                  Incompletos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          className={styles.kpiCard}
          sx={{
            borderTop: '4px solid #7b1fa2',
            cursor: 'pointer',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #7b1fa2 70%, rgba(123, 31, 162, 0.4) 100%)',
              borderRadius: '4px 4px 0 0',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
            },
            '&:hover::after': {
              opacity: 1,
            }
          }}
          onClick={() => handleKpiClick('outOfSla')}
        >
          <CardContent sx={{ p: 2 }}>
            <Box className={styles.kpiContent}>
              <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#f5f0ff' }}>
                <InventoryIcon sx={{ color: '#7b1fa2' }} />
              </Box>
              <Box className={styles.kpiDataBox}>
                <Typography variant="h4" className={styles.kpiValue}>
                  {quantityItemsOutOfLastSaleSLA}
                </Typography>
                <Typography variant="body2" className={styles.kpiLabel}>
                  30 Dias Não Vendidos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Instrução ao usuário */}
        <Typography className={styles.kpiClickInfo} sx={{ fontWeight: 500 }}>
          Clique nos indicadores para ver detalhes
        </Typography>
      </Box>
      <Box className={styles.chartsContainer}>
        <Card className={styles.chartCard1} ref={chartCard1Ref}>
          <Typography variant="h6" className={styles.chartTitle}>
            Componentes Anunciados no Mercado Livre
          </Typography>          <div
            className={styles.chartContent}
            style={{
              width: '100%',
              height: '100%',
              minHeight: chartHeights.chart1
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
              minHeight={chartHeights.chart1}
            >              <PieChart
              margin={{ top: 0, right: 0, left: 0, bottom: 30 }}
            >
                <Pie
                  data={componentsMLData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const RADIAN = Math.PI / 180;
                    const { cx, cy, midAngle, outerRadius, percent } = props;

                    // Calcular posição do texto
                    const radius = outerRadius * 0.65;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    // Mostrar percentagem apenas se for maior que 1%
                    if (percent < 0.01) return null;

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontWeight: 'bold',
                          fontSize: isMobile ? '12px' : '14px',
                          textShadow: '0px 0px 3px rgba(0,0,0,0.7)'
                        }}
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={isMobile ? 100 : 140}
                  innerRadius={0}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {componentsMLData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={0.5}
                    />
                  ))}
                </Pie>                <Tooltip
                  formatter={(value, name) => [`${value} unidades`, name]}
                  contentStyle={{
                    fontSize: isMobile ? 12 : 14,
                    backgroundColor: 'rgba(255, 255, 255, 0.97)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    padding: '8px 12px'
                  }}
                  itemStyle={{
                    padding: '4px 0',
                    color: '#333'
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '6px',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    paddingBottom: '4px'
                  }}
                />                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconSize={10}
                  iconType="circle"
                  formatter={(value, entry) => {
                    const { payload } = entry;
                    const quantity = payload.value;
                    const percent = Math.round(
                      (quantity / componentsMLData.reduce((sum, item) => sum + item.value, 0)) * 100
                    );
                    return (
                      <span
                        style={{
                          fontSize: isMobile ? '10px' : '11px',
                          color: '#333',
                          fontWeight: 500,
                          display: 'inline-block',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {`${value}: ${quantity} unidades - ${percent}%`}
                      </span>
                    );
                  }} wrapperStyle={{
                    fontSize: isMobile ? 10 : 11,
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    borderRadius: '0 0 8px 8px',
                    paddingTop: '18px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.chartCard3} ref={chartCard3Ref}>
          <Typography variant="h6" className={styles.chartTitle}>
            <span role="img" aria-label="box" style={{ marginRight: '8px' }}>📦</span>
            Quantidade de Componentes Por Caixa
          </Typography>          <div
            className={styles.chartContent}
            style={{
              width: '100%',
              height: '100%',
              minHeight: chartHeights.chart3
            }}
          >
            <ComponentsPerBoxChart
              data={boxesDataDashboard}
              isMobile={isMobile}
              chartHeight={chartHeights.chart3}
            />
          </div>
        </Card>
      </Box>

      {/* Modal de detalhes da KPI */}
      <KpiDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        data={modalData}
        loading={modalLoading}
        columns={modalColumns}
      />
    </div>
  );
};

export default Dashboard;
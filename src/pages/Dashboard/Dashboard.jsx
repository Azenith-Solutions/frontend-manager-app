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
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import styles from "./Dashboard.module.css";
import { fetchLowStockItems, fetchInObservationItems, fetchIcompleteItems, fetchItemsOutOfLastSaleSLA } from "../../service/dashboard/dashboardService";
import KpiDetailModal from "../../components/modals/KpiDetailModal/KpiDetailModal";

// mock similando carregamento do fetch de dados
const fetchKpiData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lowStockItems: 15,
        totalStockValue: 124500,
        turnoverRate: 3.2,
        obsoleteItems: 23
      });
    }, 1000);
  });
};

const Dashboard = () => {  // Dados do dashboard
  const [kpiData, setKpiData] = useState(null); // Usado para mock data na inicialização
  const [lowStockComponents, setLowStockComponents] = useState([]);
  const [quantityLowStockComponents, setQuantityLowStockComponents] = useState(lowStockComponents.length);
  const [inObservationComponents, setInObservationComponents] = useState([]);
  const [quantityInObservationComponents, setQuantityInObservationComponents] = useState(inObservationComponents.length);
  const [incompleteComponents, setIncompleteComponents] = useState([]);
  const [quantityIncompleteComponents, setQuantityIncompleteComponents] = useState(incompleteComponents.length);
  const [itemsOutOfLastSaleSLA, setItemsOutOfLastSaleSLA] = useState([]);
  const [quantityItemsOutOfLastSaleSLA, setQuantityItemsOutOfLastSaleSLA] = useState(itemsOutOfLastSaleSLA.length);
  const [loading, setLoading] = useState(true);

  // Estados para controle de modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const chartCard1Ref = useRef(null);
  const chartCard2Ref = useRef(null);
  const chartCard3Ref = useRef(null);
  const [chartHeights, setChartHeights] = useState({
    chart1: 170,
    chart2: 170,
    chart3: isTablet ? 300 : 400
  });
  const [openKpiModal, setOpenKpiModal] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);

  const getLowStockComponents = async () => {
    try {
      const response = await fetchLowStockItems();

      const lowStockItems = response.data;
      console.log("Componentes com baixo estoque:", lowStockItems);

      setLowStockComponents(lowStockItems);
      setQuantityLowStockComponents(lowStockItems.length);
      console.log("Quantidade de componentes com baixo estoque:", lowStockItems.length);
    } catch (error) {
      console.error("Error fetching low stock components:", error);
    }
  };

  const getInObservationComponents = async () => {
    try {
      const response = await fetchInObservationItems();

      setInObservationComponents(response.data);
      setQuantityInObservationComponents(response.data.length);
      console.log("Quantidade de componentes em observação:", response.data.length);
    } catch (error) {
      console.error("Error fetching in observation components:", error);
    }
  };

  const getIncompleteComponents = async () => {
    try {
      const response = await fetchIcompleteItems();

      setIncompleteComponents(response.data);
      setQuantityIncompleteComponents(response.data.length);
      console.log("Quantidade de componentes incompletos:", response.data.length);
    } catch (error) {
      console.error("Error fetching incomplete components:", error);
    }
  };

  const getItemsOutOfLastSaleSLA = async () => {
    try {
      const response = await fetchItemsOutOfLastSaleSLA();

      console.log("Componentes fora do SLA da última venda:", response.data);
      setItemsOutOfLastSaleSLA(response.data);
      setQuantityItemsOutOfLastSaleSLA(response.data.length);
    } catch (error) {
      console.error("Error fetching items out of last sale SLA:", error);
    }
  };
  // Função para abrir o modal com detalhes da KPI selecionada
  const handleKpiClick = (kpiType) => {
    setModalLoading(true);
    setModalOpen(true);

    switch (kpiType) {
      case 'lowStock':
        setModalTitle("Produtos com Baixo Estoque");
        setModalData(lowStockComponents);
        break;
      case 'observation':
        setModalTitle("Produtos em Observação");
        setModalData(inObservationComponents);
        break;
      case 'incomplete':
        setModalTitle("Produtos Incompletos");
        setModalData(incompleteComponents);
        break;
      case 'outOfSla':
        setModalTitle("Produtos Não Vendidos por 30+ Dias");
        setModalData(itemsOutOfLastSaleSLA);
        break;
      default:
        setModalTitle("Detalhes");
        setModalData([]);
    }

    // Simulando um breve carregamento para demonstração
    setTimeout(() => {
      setModalLoading(false);
    }, 300);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const kpiResult = await fetchKpiData();
      setKpiData(kpiResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "HardwareTech | Dashboard";
    getLowStockComponents();
    getInObservationComponents();
    getIncompleteComponents();
    getItemsOutOfLastSaleSLA();
    fetchData();
  }, []);

  // Adjust chart heights based on window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartCard1Ref.current && chartCard2Ref.current && chartCard3Ref.current) {
        // Get the actual card content height and adjust chart height accordingly
        const card1Height = chartCard1Ref.current.clientHeight - 40; // subtract title height
        const card2Height = chartCard2Ref.current.clientHeight - 40;
        const card3Height = chartCard3Ref.current.clientHeight - 40;

        setChartHeights({
          chart1: Math.max(card1Height, 150),
          chart2: Math.max(card2Height, 150),
          chart3: Math.max(card3Height, isTablet ? 250 : 350)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTablet]);

  // mock para grafico de linha
  const dataLine = [
    { month: 'Nov', value: 12000 },
    { month: 'Dez', value: 15000 },
    { month: 'Jan', value: 17000 },
    { month: 'Fev', value: 16000 },
    { month: 'Mar', value: 18000 },
    { month: 'Abr', value: 20000 },
  ];

  // mock para grafico de linha
  const dataBar = [
    { month: 'Nov', entrada: 300, saida: 250 },
    { month: 'Dez', entrada: 280, saida: 300 },
    { month: 'Jan', entrada: 320, saida: 290 },
    { month: 'Fev', entrada: 310, saida: 310 },
    { month: 'Mar', entrada: 330, saida: 300 },
    { month: 'Abr', entrada: 340, saida: 320 },
  ];

  const dataBarHorizon = [
    { produto: 'Resistor 220Ω', quantidade: 5 },
    { produto: 'Capacitor 10uF', quantidade: 3 },
    { produto: 'Transistor BC548', quantidade: 2 },
    { produto: 'LED Vermelho', quantidade: 6 },
    { produto: 'Microcontrolador ATmega328', quantidade: 2 },
  ];


  if (loading) {
    return (<Box className={styles.loadingContainer}>
      <CircularProgress color="primary" size={50} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 500, color: '#555' }}>
        Carregando dados do dashboard...
      </Typography>
    </Box>
    );
  }

  // Definição das colunas para o modal
  const modalColumns = [
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
  return (
    <div className={styles.dashboard}>
      <Box className={styles.kpiContainer}>
        <Card
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
        </Card>        <Card
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
        </Card>        <Card
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
        </Card>        <Card
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
        </Card>        {/* Instrução ao usuário */}
        <Typography className={styles.kpiClickInfo} sx={{ fontWeight: 500 }}>
          Clique nos indicadores para ver detalhes
        </Typography>
      </Box>
      <Box className={styles.chartsContainer}>
        <Card className={styles.chartCard1} ref={chartCard1Ref}>
          <Typography variant="h6" className={styles.chartTitle}>
            <span role="img" aria-label="chart" style={{ marginRight: '8px' }}>📈</span>
            Evolução do Valor do Estoque (últimos 6 meses)
          </Typography>          <div className={styles.chartContent} style={{ width: '100%', height: '100%', minHeight: chartHeights.chart1 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={chartHeights.chart1}>
              <LineChart data={dataLine} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: isMobile ? 8 : 10 }}
                  label={{ value: 'Mês', position: 'insideBottomRight', offset: -5, fontSize: isMobile ? 8 : 10 }}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 8 : 10 }}
                  label={{ value: 'Valor', angle: -90, position: 'insideLeft', fontSize: isMobile ? 8 : 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: isMobile ? 12 : 14 }}
                  labelStyle={{ fontSize: isMobile ? 12 : 14 }}
                  itemStyle={{ fontSize: isMobile ? 12 : 14 }}
                />                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#61131A"
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ r: isMobile ? 3 : 4, stroke: '#61131A', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: isMobile ? 5 : 6, stroke: '#61131A', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.chartCard2} ref={chartCard2Ref}>
          <Typography variant="h6" className={styles.chartTitle}>
            <span role="img" aria-label="bar chart" style={{ marginRight: '8px' }}>📊</span>
            Entrada vs. Saída de componentes (mensal)
          </Typography>          <div className={styles.chartContent} style={{ width: '100%', height: '100%', minHeight: chartHeights.chart2 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={chartHeights.chart2}>
              <BarChart data={dataBar} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: isMobile ? 8 : 10 }}
                  label={{ value: 'Mês', position: 'insideBottomRight', offset: -5, fontSize: isMobile ? 8 : 10 }}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 8 : 10 }}
                  label={{ value: 'Quantidade', angle: -90, position: 'insideLeft', fontSize: isMobile ? 8 : 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: isMobile ? 12 : 14 }}
                  labelStyle={{ fontSize: isMobile ? 12 : 14 }}
                  itemStyle={{ fontSize: isMobile ? 12 : 14 }}
                />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />                <Bar
                  dataKey="entrada"
                  fill="#689F38"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.85}
                  barSize={isMobile ? 12 : 20}
                />
                <Bar
                  dataKey="saida"
                  fill="#61131A"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.85}
                  barSize={isMobile ? 12 : 20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.chartCard3} ref={chartCard3Ref}>
          <Typography variant="h6" className={styles.chartTitle}>
            <span role="img" aria-label="alert" style={{ marginRight: '8px' }}>🚨</span>
            Produtos com Menor Estoque
          </Typography>          <div className={styles.chartContent} style={{ width: '100%', height: '100%', minHeight: chartHeights.chart3 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={chartHeights.chart3}>
              <BarChart
                layout="vertical"
                data={dataBarHorizon}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 10
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  reversed={true}
                  type="number"
                  tick={{ fontSize: isMobile ? 8 : 10 }}
                  label={{ value: 'Quantidade', position: 'insideBottom', offset: 0, fontSize: isMobile ? 8 : 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="produto"
                  tick={{ fontSize: isMobile ? 8 : 10 }}
                  width={isMobile ? 60 : 75}
                  label={{ value: 'Produto', angle: -90, position: 'insideLeft', offset: 5, fontSize: isMobile ? 8 : 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: isMobile ? 12 : 14 }}
                  labelStyle={{ fontSize: isMobile ? 12 : 14 }}
                  itemStyle={{ fontSize: isMobile ? 12 : 14 }}
                />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar
                  dataKey="quantidade"
                  fill="#61131A"
                  name="Estoque"
                  radius={[0, 4, 4, 0]}
                  fillOpacity={0.85}
                  barSize={isMobile ? 14 : 24}
                  background={{ fill: '#f5f5f5' }}
                />
              </BarChart>
            </ResponsiveContainer>
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
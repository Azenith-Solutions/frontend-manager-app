import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@mui/material";

// material ui components
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from "@mui/material";

// material ui icons
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InventoryIcon from '@mui/icons-material/Inventory';

// graficos do rechart
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

// css
import styles from "./Dashboard.module.css";

// mock similando carregamento do fettch de dados
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

const Dashboard = () => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const chartCard1Ref = useRef(null);
  const chartCard2Ref = useRef(null);
  const chartCard3Ref = useRef(null);

  useEffect(() => {
    document.title = "HardwareTech | Dashboard";

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

    fetchData();
  }, []);

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
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dados do dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Box className={styles.kpiContainer}>
        <Card className={styles.kpiCard} sx={{ borderTop: '4px solid #61131A' }}>
          <CardContent sx={{ p: 2 }}>
            <Box className={styles.kpiContent}>
              <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#ffeded' }}>
                <WarningIcon sx={{ color: '#61131A' }} />
              </Box>
              <Box className={styles.kpiDataBox}>
                <Typography variant="h4" className={styles.kpiValue}>
                  {kpiData.lowStockItems}
                </Typography>
                <Typography variant="body2" className={styles.kpiLabel}>
                  Produtos com Baixo Estoque
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className={styles.kpiCard} sx={{ borderTop: '4px solid #0288d1' }}>
          <CardContent sx={{ p: 2 }}>
            <Box className={styles.kpiContent}>
              <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#e6f7ff' }}>
                <AttachMoneyIcon sx={{ color: '#0288d1' }} />
              </Box>
              <Box className={styles.kpiDataBox}>
                <Typography variant="h4" className={styles.kpiValue}>
                  R${kpiData.totalStockValue.toLocaleString()}
                </Typography>
                <Typography variant="body2" className={styles.kpiLabel}>
                  Valor Total do Estoque
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className={styles.kpiCard} sx={{ borderTop: '4px solid #689f38' }}>
          <CardContent sx={{ p: 2 }}>
            <Box className={styles.kpiContent}>
              <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#f0f7e6' }}>
                <AutorenewIcon sx={{ color: '#689f38' }} />
              </Box>
              <Box className={styles.kpiDataBox}>
                <Typography variant="h4" className={styles.kpiValue}>
                  {kpiData.turnoverRate}x
                </Typography>
                <Typography variant="body2" className={styles.kpiLabel}>
                  Taxa de Giro de Estoque
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className={styles.kpiCard} sx={{ borderTop: '4px solid #7b1fa2' }}>
          <CardContent sx={{ p: 2 }}>
            <Box className={styles.kpiContent}>
              <Box className={styles.kpiIconBox} sx={{ backgroundColor: '#f5f0ff' }}>
                <InventoryIcon sx={{ color: '#7b1fa2' }} />
              </Box>
              <Box className={styles.kpiDataBox}>
                <Typography variant="h4" className={styles.kpiValue}>
                  {kpiData.obsoleteItems}
                </Typography>
                <Typography variant="body2" className={styles.kpiLabel}>
                  Itens Obsoletos / Parados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box className={styles.chartsContainer}>
        <Card className={styles.chartCard1} ref={chartCard1Ref}>
          <h5 className={styles.chartTitle}>📈 Evolução do Valor do Estoque (últimos 6 meses)</h5>
          <div style={{ width: '100%', height: '170px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataLine}>
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
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#61131A"
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ r: isMobile ? 3 : 4 }}
                  activeDot={{ r: isMobile ? 5 : 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.chartCard2} ref={chartCard2Ref}>
          <h5 className={styles.chartTitle}>📊 Entrada vs. Saída de componentes (mensal)</h5>
          <div style={{ width: '100%', height: '170px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar}>
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
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar dataKey="entrada" fill="#689F38" />
                <Bar dataKey="saida" fill="#61131A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.chartCard3} ref={chartCard3Ref}>
          <h5 className={styles.chartTitle}>🚨 Produtos com Menor Estoque</h5>
          <div style={{ width: '100%', height: isTablet ? '300px' : '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={dataBarHorizon}
                margin={{
                  top: 5,
                  right: 5,
                  left: 0,
                  bottom: 0
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
                  width={75}
                  label={{ value: 'Produto', angle: -90, position: 'insideLeft', offset: 5, fontSize: isMobile ? 8 : 10 }}
                />
                <Tooltip
                  contentStyle={{ fontSize: isMobile ? 12 : 14 }}
                  labelStyle={{ fontSize: isMobile ? 12 : 14 }}
                  itemStyle={{ fontSize: isMobile ? 12 : 14 }}
                />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar dataKey="quantidade" fill="#61131A" name="Estoque" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Box>
    </div>
  );
};

export default Dashboard;
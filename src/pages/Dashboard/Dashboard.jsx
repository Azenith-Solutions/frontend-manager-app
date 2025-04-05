import { useEffect, useState } from "react";
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

import styles from "./Dashboard.module.css";

// Mock data function to simulate API fetch
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
    </div>
  );
};

export default Dashboard;
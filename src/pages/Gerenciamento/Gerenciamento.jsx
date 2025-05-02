import React, { useEffect, useState } from "react";
import styles from "./Gerenciamento.module.css";
import { api } from "../../provider/apiProvider";

// Material UI Components
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper
} from "@mui/material";

// Material UI Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AddIcon from '@mui/icons-material/Add';

const Gerenciamento = () => {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [stats] = useState({
    totalComponents: 1367,
    inStockComponents: 1240
  });

  useEffect(() => {
    document.title = "HardwareTech | Gerenciamento";
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/components');
      console.log('Resposta dos componentes:', response);
      
      const responseData = response.data.data || response.data;
      
      if (Array.isArray(responseData)) {
        const formattedComponents = responseData.map((item) => ({
          id: item.idHardWareTech,
          caixa: item.caixa,
          partNumber: item.partNumber,
          quantidade: item.quantidade,
          flagML: item.flagML ? 'Sim' : 'Não',
          idMercadoLivre: item.codigoML || 'N/A',
          flagVerificado: item.flagVerificado ? 'Sim' : 'Não',
          condicao: item.condicao || 'N/A',
          observacao: item.verificado || '',
          descricao: item.descricao || 'Sem descrição'
        }));
        
        setComponents(formattedComponents);
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

  const filteredComponents = components.filter(
    (item) => 
      item.partNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toString().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando dados do gerenciamento...
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.gerenciamento}>
      <Paper elevation={0} className={styles.toolbar}>
        <Box className={styles.searchBox}>
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <input 
            type="text" 
            placeholder="Buscar componente..."
            className={styles.searchInput}e
            onChange={handleSearchChange}
            value={searchText}
          />
        </Box>
        
        <Box className={styles.headerActions}>
          <IconButton size="small" title="Filtrar" className={styles.iconButton}>
            <FilterListIcon fontSize="small" />
          </IconButton>
          
          <IconButton size="small" title="Exportar" className={styles.iconButton}>
            <FileDownloadIcon fontSize="small" />
          </IconButton>
          
          <IconButton size="small" title="Importar" className={styles.iconButton}>
            <FileUploadIcon fontSize="small" />
          </IconButton>
          
          <Button 
            size="small" 
            variant="contained" 
            disableElevation
            startIcon={<AddIcon />}
            sx={{ 
              bgcolor: '#61131A', 
              '&:hover': { bgcolor: '#4e0f15' },
              borderRadius: '4px',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              px: 2
            }}
          >
            Criar Pedido
          </Button>
        </Box>
      </Paper>
      <Container maxWidth="xl" sx={{ pt: 2 }}>
        {/* Additional content can be added here */}
      </Container>
    </div>
  );
};

export default Gerenciamento;

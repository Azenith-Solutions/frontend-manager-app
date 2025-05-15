import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
  Paper,
  Badge
} from "@mui/material";

// Material UI Icons
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * FilterButton - Componente para o botão de filtro com contagem de filtros ativos
 *
 * @param {Object} props
 * @param {number} props.activeFilterCount - Número de filtros ativos
 * @param {function} props.onClick - Função chamada ao clicar no botão
 */
export const FilterButton = ({ 
  activeFilterCount = 0, 
  onClick
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: activeFilterCount > 0 ? 'rgba(97,19,26,0.08)' : '#f0f2f5',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: activeFilterCount > 0 ? '1px solid rgba(97,19,26,0.2)' : '1px solid transparent',
        '&:hover': {
          backgroundColor: activeFilterCount > 0 ? 'rgba(97,19,26,0.12)' : '#e2e6eb',
          transform: 'scale(1.02)',
        }
      }}
      onClick={onClick}
    >
      <Badge 
        badgeContent={activeFilterCount} 
        color="error"
        sx={{ 
          '& .MuiBadge-badge': { 
            fontSize: '0.6rem',
            height: 16,
            minWidth: 16,
            padding: '0 4px'
          } 
        }}
      >
        <FilterListIcon 
          fontSize="small" 
          sx={{ 
            color: '#61131A',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotate(180deg)'
            }
          }} 
        />
      </Badge>
      <Typography
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#444',
          userSelect: 'none'
        }}
      >
        Filtrar
      </Typography>
    </Box>
  );
};

/**
 * DatagridHeader - Componente genérico para o header de datagrids
 *
 * @param {Object} props
 * @param {string} props.title - Título do botão de adicionar (ex: "Adicionar componente")
 * @param {string} props.searchPlaceholder - Placeholder do campo de busca
 * @param {Object} props.searchProps - Props para controle do campo de busca
 * @param {function} props.onAddClick - Função para adicionar novo item
 * @param {number} props.activeFilterCount - Número de filtros ativos
 * @param {function} props.onFilterClick - Função para abrir o menu de filtros
 * @param {Array} props.statsCards - Array com cartões de estatísticas para exibir
 */
const DatagridHeader = ({
  title = "Adicionar",
  searchPlaceholder = "Buscar...",
  searchProps = {},
  onAddClick,
  activeFilterCount = 0,
  onFilterClick,
  statsCards = []
}) => {
  const { value: searchText = "", onChange: handleSearchChange = () => {} } = searchProps;

  return (
    <Paper elevation={1} sx={{ 
      p: '10px 16px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      boxShadow: '0 2px 8px rgba(255, 255, 255, 0.08)',
      borderRadius: '8px',
      mb: 2,
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        alignItems: 'center', 
        gap: '12px',
        flex: '1 1 auto',
        minWidth: '0', 
      }}>
        {/* Campo de Busca */}
        <Box
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: '250px' },
            minWidth: { xs: '100%', sm: '250px' },
            maxWidth: '300px',
            height: '38px',
            backgroundColor: '#f0f2f5',
            borderRadius: '20px',
            px: 1.5,
            overflow: 'hidden',
            border: '1px solid transparent',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#e9ecf0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            },
            '&:focus-within': {
              backgroundColor: '#fff',
              boxShadow: '0 0 0 2px rgba(97,19,26,0.1)',
              border: '1px solid #e0e0e0'
            }
          }}
        >
          <SearchIcon 
            sx={{ 
              color: '#61131A', 
              fontSize: 18,
              opacity: 0.7,
              mr: 1,
              transition: 'transform 0.2s ease',
              transform: 'rotate(-5deg)',
              '&:hover': {
                transform: 'rotate(0deg) scale(1.1)'
              }
            }} 
          />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={handleSearchChange}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: '#333',
              width: '100%',
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '0px',
              fontFamily: 'inherit'
            }}
          />
        </Box>
        
        {/* Botões de Filtrar e Exportar */}
        <Box sx={{ 
          display: 'flex', 
          gap: '10px',
          flexShrink: 0,
        }}>
          {/* Botão de Filtrar */}
          <FilterButton
            activeFilterCount={activeFilterCount}
            onClick={onFilterClick}
          />
          
          {/* Botão de Exportar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: '#f0f2f5',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid transparent',
              '&:hover': {
                backgroundColor: '#e2e6eb',
                transform: 'scale(1.02)',
              }
            }}
          >
            <FileDownloadIcon 
              fontSize="small" 
              sx={{ 
                color: '#2980b9',
                transition: 'transform 0.2s ease',
              }} 
            />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#444',
                userSelect: 'none'
              }}
            >
              Exportar
            </Typography>
          </Box>
        </Box>
        
        {/* Separador vertical */}
        <Divider orientation="vertical" flexItem sx={{ 
          height: 28, 
          mx: 0.5,
          display: { xs: 'none', md: 'block' } 
        }} />
        
        {/* Cards de estatísticas */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          gap: '12px',
          ml: { xs: 0, md: 0.5 },
          flexGrow: 1,
          justifyContent: { xs: 'flex-start', md: 'flex-start' },
        }}>
          {statsCards.map((card, index) => (
            <Card key={index} sx={{ 
              height: '38px', 
              flex: '1 1 140px',
              maxWidth: '180px',
              minWidth: '140px',
              borderTop: `3px solid ${card.color || '#61131A'}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              overflow: 'visible',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ 
                p: '4px 8px', 
                pb: '4px !important', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: card.iconBgColor || '#ffeded',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1,
                    flexShrink: 0
                  }}>
                    {card.icon}
                  </Box>
                  <Box sx={{ 
                    minWidth: 0, 
                    overflow: 'hidden',
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 700, 
                      lineHeight: 1,
                      mb: 0,
                      color: '#333',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      fontSize: '0.6rem',
                      color: '#666',
                      fontWeight: 500,
                      lineHeight: 1,
                      mt: '0px',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {card.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
      
      {/* Botão de Adicionar */}
      <Button 
        size="small" 
        variant="contained" 
        disableElevation
        startIcon={<AddIcon fontSize="small" />}
        onClick={onAddClick}
        sx={{ 
          height: '38px',
          bgcolor: '#61131A', 
          '&:hover': { bgcolor: '#4e0f15' },
          borderRadius: '4px',
          textTransform: 'none',
          fontSize: '0.8rem',
          fontWeight: 600,
          px: 1.5,
          minWidth: '100px',
          flexShrink: 0,
          ml: { xs: 0, sm: 'auto' }, 
          alignSelf: { xs: 'flex-start', sm: 'center' } 
        }}
      >
        {title}
      </Button>
    </Paper>
  );
};

export default DatagridHeader;
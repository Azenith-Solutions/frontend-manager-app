import React from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Button,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from "@mui/material";

// Material UI Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';

/**
 * UsuariosFilter - Componente de filtro específico para a página de Usuários
 */
const UsuariosFilter = ({ 
  anchorEl, 
  onClose,
  activeFilters,
  toggleCargoFilter,
  toggleStatusFilter,
  togglePeriodoFilter,
  clearAllFilters
}) => {
  // Contagem de filtros ativos
  const activeFilterCount = [
    activeFilters.cargo?.length > 0,
    activeFilters.status !== null,
    activeFilters.periodo !== null,
  ].filter(Boolean).length;

  const cargoOptions = [
    { value: 'Administrador', icon: <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#8e44ad' }} /> },
    { value: 'Gerente', icon: <BadgeIcon fontSize="small" sx={{ color: '#2980b9' }} /> },
    { value: 'Operador', icon: <BadgeIcon fontSize="small" sx={{ color: '#27ae60' }} /> },
    { value: 'Suporte', icon: <BadgeIcon fontSize="small" sx={{ color: '#f39c12' }} /> }
  ];

  const periodoOptions = [
    { value: '7dias', label: 'Últimos 7 dias' },
    { value: '30dias', label: 'Últimos 30 dias' },
    { value: '90dias', label: 'Últimos 90 dias' },
    { value: 'ano', label: 'Este ano' }
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: 250,
          maxHeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          mt: 0.5
        }
      }}
    >
      <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 700, 
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          Filtros de Usuários
          {activeFilterCount > 0 && (
            <Chip 
              label={activeFilterCount}
              size="small"
              color="error"
              sx={{ 
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600
              }}
            />
          )}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#666', 
            display: 'block',
            mb: 1
          }}
        >
          Use os filtros para refinar a lista de usuários
        </Typography>
        {activeFilterCount > 0 && (
          <Button
            size="small"
            startIcon={<ClearAllIcon fontSize="small" />}
            onClick={clearAllFilters}
            sx={{
              fontSize: '0.7rem',
              textTransform: 'none',
              mb: 1,
              p: 0.5,
              color: '#61131A',
              '&:hover': { backgroundColor: 'rgba(97,19,26,0.08)' }
            }}
          >
            Limpar todos os filtros
          </Button>
        )}
      </Box>
      
      <Divider />
      
      {/* Filtro por Cargo */}
      <Box sx={{ p: 1 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            mx: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#61131A' }} />
          Cargo
          {activeFilters.cargo?.length > 0 && (
            <Chip 
              label={activeFilters.cargo.length} 
              size="small"
              sx={{ 
                height: 16, 
                fontSize: '0.65rem', 
                '& .MuiChip-label': { px: 1 } 
              }}
            />
          )}
        </Typography>
        
        {cargoOptions.map(option => (
          <MenuItem 
            key={option.value} 
            onClick={() => toggleCargoFilter(option.value)}
            dense
            sx={{ minHeight: '36px' }}
          >
            <Checkbox 
              size="small"
              edge="start"
              checked={activeFilters.cargo?.includes(option.value)}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              sx={{ p: 0.5, mr: 1 }}
            />
            <ListItemText 
              primary={option.value} 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                fontWeight: activeFilters.cargo?.includes(option.value) ? 600 : 400
              }} 
            />
            <ListItemIcon sx={{ minWidth: 'unset' }}>
              {option.icon}
            </ListItemIcon>
          </MenuItem>
        ))}
      </Box>
      
      <Divider />
      
      {/* Filtro por Status */}
      <Box sx={{ p: 1 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            mx: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
          Status
          {activeFilters.status !== null && (
            <Chip 
              label="1" 
              size="small"
              sx={{ 
                height: 16, 
                fontSize: '0.65rem', 
                '& .MuiChip-label': { px: 1 } 
              }}
            />
          )}
        </Typography>
        <MenuItem 
          onClick={() => toggleStatusFilter('Ativo')}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.status === 'Ativo'}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Ativos" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.status === 'Ativo' ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
          </ListItemIcon>
        </MenuItem>        <MenuItem 
          onClick={() => toggleStatusFilter('Inativo')}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.status === 'Inativo'}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Inativos" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.status === 'Inativo' ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CancelIcon fontSize="small" sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem 
          onClick={() => toggleStatusFilter('Indefinido')}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.status === 'Indefinido'}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Indefinidos" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.status === 'Indefinido' ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <HelpOutlineIcon fontSize="small" sx={{ color: '#7f8c8d' }} />
          </ListItemIcon>
        </MenuItem>
      </Box>
      
      <Divider />
      
      {/* Filtro por Data de Cadastro */}
      <Box sx={{ p: 1 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600, 
            mx: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CalendarMonthIcon fontSize="small" sx={{ color: '#2980b9' }} />
          Data de Cadastro
          {activeFilters.periodo !== null && (
            <Chip 
              label="1" 
              size="small"
              sx={{ 
                height: 16, 
                fontSize: '0.65rem', 
                '& .MuiChip-label': { px: 1 } 
              }}
            />
          )}
        </Typography>
        
        {periodoOptions.map(option => (
          <MenuItem 
            key={option.value} 
            onClick={() => togglePeriodoFilter(option.value)}
            dense
            sx={{ minHeight: '36px' }}
          >
            <Checkbox 
              size="small"
              edge="start"
              checked={activeFilters.periodo === option.value}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              sx={{ p: 0.5, mr: 1 }}
            />
            <ListItemText 
              primary={option.label} 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                fontWeight: activeFilters.periodo === option.value ? 600 : 400
              }} 
            />
          </MenuItem>
        ))}
      </Box>
    </Menu>
  );
};

export default UsuariosFilter;
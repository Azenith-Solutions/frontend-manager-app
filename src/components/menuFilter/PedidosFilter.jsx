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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';

/**
 * PedidosFilter - Componente de filtro específico para a página de Pedidos
 */
const PedidosFilter = ({ 
  anchorEl, 
  onClose,
  activeFilters,
  toggleStatusFilter,
  toggleAprovadoFilter,
  togglePeriodoFilter,
  toggleClienteFilter,
  availableClientes = [],
  clearAllFilters
}) => {
  // Contagem de filtros ativos
  const activeFilterCount = [
    activeFilters.status?.length > 0,
    activeFilters.aprovado !== null,
    activeFilters.periodo !== null,
    activeFilters.clientes?.length > 0
  ].filter(Boolean).length;

  const statusOptions = [
    { value: 'Aprovado', color: '#27ae60' },
    { value: 'Pendente', color: '#f39c12' },
    { value: 'Entregue', color: '#3498db' },
    { value: 'Cancelado', color: '#e74c3c' }
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
          Filtros de Pedidos
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
          Use os filtros para refinar a lista de pedidos
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
          <LocalShippingIcon fontSize="small" sx={{ color: '#61131A' }} />
          Status
          {activeFilters.status?.length > 0 && (
            <Chip 
              label={activeFilters.status.length} 
              size="small"
              sx={{ 
                height: 16, 
                fontSize: '0.65rem', 
                '& .MuiChip-label': { px: 1 } 
              }}
            />
          )}
        </Typography>
        
        {statusOptions.map(option => (
          <MenuItem 
            key={option.value} 
            onClick={() => toggleStatusFilter(option.value)}
            dense
            sx={{ minHeight: '36px' }}
          >
            <Checkbox 
              size="small"
              edge="start"
              checked={activeFilters.status?.includes(option.value)}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              sx={{ p: 0.5, mr: 1 }}
            />
            <ListItemText 
              primary={option.value} 
              primaryTypographyProps={{ 
                fontSize: '0.8rem',
                fontWeight: activeFilters.status?.includes(option.value) ? 600 : 400
              }} 
            />
            <ListItemIcon sx={{ minWidth: 'unset' }}>
              <Chip 
                size="small"
                label=""
                sx={{ 
                  width: 12,
                  height: 12,
                  backgroundColor: option.color,
                  '& .MuiChip-label': { p: 0 }
                }}
              />
            </ListItemIcon>
          </MenuItem>
        ))}
      </Box>
      
      <Divider />
      
      {/* Filtro por Aprovado */}
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
          Aprovação
          {activeFilters.aprovado !== null && (
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
          onClick={() => toggleAprovadoFilter(true)}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.aprovado === true}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Aprovados" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.aprovado === true ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem 
          onClick={() => toggleAprovadoFilter(false)}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.aprovado === false}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Não aprovados" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.aprovado === false ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CancelIcon fontSize="small" sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
        </MenuItem>
      </Box>
      
      <Divider />
      
      {/* Filtro por Período */}
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
          Período
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
      
      {/* Filtro por Cliente */}
      {availableClientes.length > 0 && (
        <>
          <Divider />
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
              <PersonIcon fontSize="small" sx={{ color: '#8e44ad' }} />
              Cliente
              {activeFilters.clientes?.length > 0 && (
                <Chip 
                  label={activeFilters.clientes.length} 
                  size="small"
                  sx={{ 
                    height: 16, 
                    fontSize: '0.65rem', 
                    '& .MuiChip-label': { px: 1 } 
                  }}
                />
              )}
            </Typography>
            
            {availableClientes.map(cliente => (
              <MenuItem 
                key={cliente.id} 
                onClick={() => toggleClienteFilter(cliente.id)}
                dense
                sx={{ minHeight: '36px' }}
              >
                <Checkbox 
                  size="small"
                  edge="start"
                  checked={activeFilters.clientes?.includes(cliente.id)}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  sx={{ p: 0.5, mr: 1 }}
                />
                <ListItemText 
                  primary={cliente.nome || cliente.cnpjCpf} 
                  primaryTypographyProps={{ 
                    fontSize: '0.8rem',
                    fontWeight: activeFilters.clientes?.includes(cliente.id) ? 600 : 400
                  }} 
                />
              </MenuItem>
            ))}
          </Box>
        </>
      )}
    </Menu>
  );
};

export default PedidosFilter;
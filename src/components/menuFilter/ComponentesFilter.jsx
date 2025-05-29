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
import StorageIcon from '@mui/icons-material/Storage';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ClearAllIcon from '@mui/icons-material/ClearAll';

/**
 * ComponentesFilter - Componente de filtro específico para a página de Componentes
 */
const ComponentesFilter = ({ 
  anchorEl, 
  onClose,
  availableCaixas = [],
  activeFilters,
  toggleCaixaFilter,
  toggleMercadoLivreFilter,
  toggleVerificadoFilter,
  toggleCondicaoFilter,
  clearAllFilters
}) => {
  // Contagem de filtros ativos
  const activeFilterCount = [
    activeFilters.caixas?.length > 0,
    activeFilters.mercadoLivre !== null,
    activeFilters.verificado !== null,
    activeFilters.condicao?.length > 0
  ].filter(Boolean).length;

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
          Filtros de Componentes
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
          Use os filtros para refinar a lista de componentes
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
      
      {/* Filtro por Caixa */}
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
          <StorageIcon fontSize="small" sx={{ color: '#61131A' }} />
          Caixa 
          {activeFilters.caixas?.length > 0 && (
            <Chip 
              label={activeFilters.caixas.length} 
              size="small"
              sx={{ 
                height: 16, 
                fontSize: '0.65rem', 
                '& .MuiChip-label': { px: 1 } 
              }}
            />
          )}
        </Typography>
        {availableCaixas.length === 0 ? (
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mx: 1, mt: 1, fontStyle: 'italic' }}>
            Nenhuma caixa encontrada
          </Typography>
        ) : (
          availableCaixas.map(caixa => (
            <MenuItem 
              key={caixa} 
              onClick={() => toggleCaixaFilter(caixa)}
              dense
              sx={{ minHeight: '36px' }}
            >
              <Checkbox 
                size="small"
                edge="start"
                checked={activeFilters.caixas.includes(caixa)}
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                sx={{ p: 0.5, mr: 1 }}
              />
              <ListItemText 
                primary={caixa} 
                primaryTypographyProps={{ 
                  fontSize: '0.8rem',
                  fontWeight: activeFilters.caixas.includes(caixa) ? 600 : 400
                }} 
              />
            </MenuItem>
          ))
        )}
      </Box>
      
      <Divider />
      
      {/* Filtro por Mercado Livre */}
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
          <StorefrontIcon fontSize="small" sx={{ color: '#27ae60' }} />
          Mercado Livre
          {activeFilters.mercadoLivre !== null && (
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
          onClick={() => toggleMercadoLivreFilter(true)}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.mercadoLivre === true}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Anunciados" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.mercadoLivre === true ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem 
          onClick={() => toggleMercadoLivreFilter(false)}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.mercadoLivre === false}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Não anunciados" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.mercadoLivre === false ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CancelIcon fontSize="small" sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
        </MenuItem>
      </Box>
      
      <Divider />
      
      {/* Filtro por Verificado */}
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
          <VerifiedIcon fontSize="small" sx={{ color: '#2980b9' }} />
          Verificação
          {activeFilters.verificado !== null && (
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
          onClick={() => toggleVerificadoFilter(true)}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.verificado === true}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Verificados" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.verificado === true ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem 
          onClick={() => toggleVerificadoFilter(false)}
          dense
          sx={{ minHeight: '36px' }}
        >
          <Checkbox 
            size="small"
            edge="start"
            checked={activeFilters.verificado === false}
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            sx={{ p: 0.5, mr: 1 }}
          />
          <ListItemText 
            primary="Não verificados" 
            primaryTypographyProps={{ 
              fontSize: '0.8rem',
              fontWeight: activeFilters.verificado === false ? 600 : 400
            }} 
          />
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <CancelIcon fontSize="small" sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
        </MenuItem>
      </Box>
      
      {/* Apenas mostrar submenu de condição se verificado for true */}
      {activeFilters.verificado === true && (
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
              <InfoOutlinedIcon fontSize="small" sx={{ color: '#f39c12' }} />
              Condição
              {activeFilters.condicao?.length > 0 && (
                <Chip 
                  label={activeFilters.condicao.length} 
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
              onClick={() => toggleCondicaoFilter('Bom Estado')}
              dense
              sx={{ minHeight: '36px' }}
            >
              <Checkbox 
                size="small"
                edge="start"
                checked={activeFilters.condicao.includes('Bom Estado')}
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                sx={{ p: 0.5, mr: 1 }}
              />
              <ListItemText 
                primary="Bom estado" 
                primaryTypographyProps={{ 
                  fontSize: '0.8rem',
                  fontWeight: activeFilters.condicao.includes('Bom Estado') ? 600 : 400
                }} 
              />
              <ListItemIcon sx={{ minWidth: 'unset' }}>
                <Chip 
                  size="small"
                  label=""
                  sx={{ 
                    width: 12,
                    height: 12,
                    backgroundColor: '#27ae60',
                    '& .MuiChip-label': { p: 0 }
                  }}
                />
              </ListItemIcon>
            </MenuItem>
            <MenuItem 
              onClick={() => toggleCondicaoFilter('Observação')}
              dense
              sx={{ minHeight: '36px' }}
            >
              <Checkbox 
                size="small"
                edge="start"
                checked={activeFilters.condicao.includes('Observação')}
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                sx={{ p: 0.5, mr: 1 }}
              />
              <ListItemText 
                primary="Com observação" 
                primaryTypographyProps={{ 
                  fontSize: '0.8rem',
                  fontWeight: activeFilters.condicao.includes('Observação') ? 600 : 400
                }} 
              />
              <ListItemIcon sx={{ minWidth: 'unset' }}>
                <Chip 
                  size="small"
                  label=""
                  sx={{ 
                    width: 12,
                    height: 12,
                    backgroundColor: '#e74c3c',
                    '& .MuiChip-label': { p: 0 }
                  }}
                />
              </ListItemIcon>
            </MenuItem>
          </Box>
        </>
      )}
    </Menu>
  );
};

export default ComponentesFilter;
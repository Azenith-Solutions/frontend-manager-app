import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from '@mui/material';
import styles from './KpiDetailModal.module.css';

const KpiDetailModal = ({ open, onClose, title, data, loading, columns }) => {
    if (!columns || columns.length === 0) {
        columns = data && data.length > 0
            ? Object.keys(data[0]).map(key => ({
                field: key,
                headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
            }))
            : [];
    }

    return (<Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="kpi-detail-dialog-title"
        TransitionProps={{
            timeout: 400
        }}
        PaperProps={{
            sx: {
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                animation: 'fadeIn 0.3s ease-out',
                '@keyframes fadeIn': {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(-20px)'
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                }
            }
        }}
    >
        <DialogTitle id="kpi-detail-dialog-title" className={styles.dialogTitle}>
            <Box className={styles.titleContainer}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Ícones dinâmicos baseados no tipo de KPI */}
                    {title.toLowerCase().includes('baixo') &&
                        <Box
                            component="span"
                            sx={{
                                color: '#61131A',
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#ffeded',
                                p: 1,
                                borderRadius: '50%',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" fill="currentColor" />
                            </svg>
                        </Box>
                    }
                    {title.toLowerCase().includes('observ') &&
                        <Box
                            component="span"
                            sx={{
                                color: '#0288d1',
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#e6f7ff',
                                p: 1,
                                borderRadius: '50%',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
                            </svg>
                        </Box>
                    }
                    {title.toLowerCase().includes('incompl') &&
                        <Box
                            component="span"
                            sx={{
                                color: '#689f38',
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f0f7e6',
                                p: 1,
                                borderRadius: '50%',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="currentColor" />
                            </svg>
                        </Box>
                    }
                    {title.toLowerCase().includes('não vend') &&
                        <Box
                            component="span"
                            sx={{
                                color: '#7b1fa2',
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f5f0ff',
                                p: 1,
                                borderRadius: '50%',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" />
                            </svg>
                        </Box>
                    }
                    {/* Texto do título com gradiente para destacar */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(90deg, #333333 0%, #555555 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {title}
                    </Typography>
                </Box><Box className={styles.badgeContainer}>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        className={styles.countBadge}
                    >
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="currentColor" />
                            </svg>
                            Total: {data ? data.length : 0} itens
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ padding: 0 }}>
            {loading ? (<Box display="flex" justifyContent="center" alignItems="center" minHeight="300px" flexDirection="column" gap={2}>
                <CircularProgress
                    size={40}
                    thickness={4}
                    sx={{
                        color: '#61131A',
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                        }
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Carregando dados</Typography>
                    <Typography variant="body2" color="textSecondary">Por favor, aguarde...</Typography>
                </Box>
            </Box>
            ) : data && data.length > 0 ? (
                <TableContainer component={Paper} className={styles.tableContainer} sx={{ boxShadow: 'none', borderRadius: 0 }}>
                    <Table stickyHeader aria-label="kpi details table" size="medium">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.field}
                                        align={column.align || 'left'}
                                        sx={{
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap',
                                            padding: '12px 16px',
                                            borderBottom: '2px solid rgba(97, 19, 26, 0.3)',
                                            color: '#444',
                                            fontSize: '0.87rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                background: 'linear-gradient(90deg, rgba(97, 19, 26, 0.7) 0%, rgba(97, 19, 26, 0.1) 100%)',
                                                borderRadius: '1px'
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                cursor: 'pointer'
                                            }
                                        }}
                                        onClick={() => {
                                            // Futuro: Ordenar tabela por coluna
                                            console.log(`Ordenando por ${column.field}`);
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: column.align === 'right' ? 'flex-end' :
                                                column.align === 'center' ? 'center' : 'flex-start',
                                            gap: '4px'
                                        }}>
                                            {column.headerName}
                                            <Box component="span" sx={{
                                                fontSize: '14px',
                                                opacity: 0.7,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" fill="currentColor" />
                                                </svg>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>                                <TableBody>
                            {data.map((row, index) => (
                                <TableRow
                                    key={row.idComponente || index}
                                    hover
                                    className={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                                    sx={{
                                        transition: 'background-color 0.2s',
                                        '--row-index': index,
                                        '&:hover': {
                                            backgroundColor: 'rgba(97, 19, 26, 0.04)',
                                            boxShadow: 'inset 0 0 0 1px rgba(97, 19, 26, 0.1)'
                                        }
                                    }}
                                >
                                    {columns.map((column) => {
                                        const value = column.valueGetter
                                            ? column.valueGetter(row)
                                            : row[column.field];

                                        return (<TableCell
                                            key={`${row.idComponente || index}-${column.field}`}
                                            align={column.align || 'left'}
                                            sx={{
                                                padding: '12px 16px',
                                                position: 'relative',
                                                '&::after': column.field === 'status' || column.field.toLowerCase().includes('status') ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: '4px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '4px',
                                                    height: '70%',
                                                    borderRadius: '2px',
                                                    backgroundColor:
                                                        (value + '').toLowerCase().includes('baixo') ||
                                                            (value + '').toLowerCase().includes('crítico') ?
                                                            '#e74c3c' :
                                                            (value + '').toLowerCase().includes('normal') ||
                                                                (value + '').toLowerCase().includes('ok') ?
                                                                '#2ecc71' :
                                                                (value + '').toLowerCase().includes('médio') ||
                                                                    (value + '').toLowerCase().includes('medio') ||
                                                                    (value + '').toLowerCase().includes('atenção') ?
                                                                    '#f39c12' : 'transparent'
                                                } : {}
                                            }}
                                        >
                                            {column.renderCell ? column.renderCell(value, row) : value}
                                        </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (<Box display="flex" justifyContent="center" alignItems="center" minHeight="300px" className={styles.emptyMessage}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: 'rgba(97, 19, 26, 0.03)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(97, 19, 26, 0.2)'
                }}>
                    <Box sx={{ mb: 2, color: '#61131A', opacity: 0.7 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                            <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor" />
                        </svg>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>Nenhum item encontrado</Typography>
                    <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                        Não há dados disponíveis para este filtro.
                    </Typography>
                </Box>
            </Box>
            )}
        </DialogContent>            <DialogActions sx={{
            padding: '16px 24px',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f2f5'
                }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" fill="#666" />
                    </svg>
                </Box>
                <Typography variant="caption" sx={{
                    color: '#666',
                    fontStyle: 'italic',
                    fontSize: '0.75rem'
                }}>
                    Última atualização: {new Date().toLocaleString()}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: 'rgba(97, 19, 26, 0.5)',
                        color: '#61131A',
                        '&:hover': {
                            backgroundColor: 'rgba(97, 19, 26, 0.04)',
                            borderColor: '#61131A'
                        }
                    }}
                    startIcon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor" />
                        </svg>
                    }
                >
                    Exportar
                </Button>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        backgroundColor: '#61131A',
                        boxShadow: '0 2px 8px rgba(97, 19, 26, 0.2)',
                        '&:hover': {
                            backgroundColor: '#4e0f15',
                            boxShadow: '0 4px 12px rgba(97, 19, 26, 0.3)'
                        }
                    }}
                >
                    Fechar
                </Button>
            </Box>
        </DialogActions>
    </Dialog>
    );
};

export default KpiDetailModal;

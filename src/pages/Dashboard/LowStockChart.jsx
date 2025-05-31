import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, ResponsiveContainer, Cell, ReferenceLine, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import styles from './LowStockChart.module.css';

/**
 * Componente para renderização do tooltip personalizado
 * 
 * @param {Object} props - Propriedades do tooltip
 * @param {boolean} props.active - Se o tooltip está ativo
 * @param {Array} props.payload - Dados do ponto onde o tooltip está sendo exibido
 * @returns {JSX.Element|null} Componente de tooltip ou null se inativo
 */
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    let statusColor, statusMessage;

    if (item.isLow) {
        statusColor = '#f44336';
        statusMessage = '⚠️ Estoque abaixo do limite crítico';
    } else if (item.isCritical) {
        statusColor = '#FF9800';
        statusMessage = '⚠️ Estoque no limite crítico';
    } else {
        statusColor = '#61131A';
        statusMessage = '✓ Estoque adequado';
    }

    return (
        <div className={styles.tooltipContainer}>
            <p className={styles.tooltipName}>{item.name}</p>
            <p className={styles.tooltipValue} style={{ color: statusColor }}>
                Estoque: <strong>{item.quantidade}</strong>
            </p>
            <p className={styles.tooltipLimit}>
                <span className={styles.tooltipLimitIndicator}></span>
                Limite crítico: <strong>3</strong>
            </p>
            <p className={`${styles.tooltipStatus} ${item.isLow ? styles.tooltipAlert : item.isCritical ? styles.tooltipWarning : styles.tooltipNormal}`}>
                {statusMessage}
            </p>
        </div>
    );
};

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array
};

/**
 * Componente TinyBarChart para exibir produtos com baixo estoque
 * Inclui uma linha de referência para o limite crítico
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados dos produtos com estoque baixo
 * @param {boolean} props.isMobile - Flag para indicar se está em visualização mobile
 * @param {number} props.chartHeight - Altura do gráfico
 * @returns {JSX.Element} Componente de gráfico de barras simplificado
 */
const LowStockChart = ({ data, isMobile, chartHeight }) => {  // Constantes
    const CRITICAL_STOCK_LIMIT = 3;
    const CHART_MARGINS = { top: 20, right: 30, left: isMobile ? 60 : 75, bottom: 5 };
    const BAR_SIZE = isMobile ? 14 : 20;
    // Encontrar o valor máximo para garantir que a linha seja visível
    const maxValue = useMemo(() => {
        const max = Math.max(...data.map(item => item.quantidade));
        return Math.max(max, CRITICAL_STOCK_LIMIT + 1); // Garantir espaço para a linha
    }, [data, CRITICAL_STOCK_LIMIT]);
    // Preparar dados para o gráfico usando memoização para performance
    const enhancedData = useMemo(() => {
        return data.map(item => ({
            name: item.produto,
            quantidade: item.quantidade,
            isLow: item.quantidade < CRITICAL_STOCK_LIMIT,
            isCritical: item.quantidade === CRITICAL_STOCK_LIMIT,
            isNormal: item.quantidade > CRITICAL_STOCK_LIMIT
        }));
    }, [data, CRITICAL_STOCK_LIMIT]);
    // Função para determinar a cor da barra baseada no limite crítico
    const getBarClassName = (quantidade) => {
        if (quantidade < CRITICAL_STOCK_LIMIT) return styles.lowStockBar;
        if (quantidade === CRITICAL_STOCK_LIMIT) return styles.criticalStockBar;
        return styles.normalBar;
    }; return (
        <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={enhancedData}
                    layout="vertical"
                    margin={CHART_MARGINS}
                    className={styles.tinyBarChart}
                >
                    {/* Eixos para garantir que a linha de limite seja visível */}          <XAxis
                        type="number"
                        domain={[0, maxValue]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10 }}
                        allowDecimals={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#666' }}
                        width={CHART_MARGINS.left}
                    />
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />

                    {/* Linha laranja de referência para o limite crítico */}          {/* Linha de fundo para destacar ainda mais o limite */}
                    <ReferenceLine
                        x={CRITICAL_STOCK_LIMIT}
                        stroke="#FFF3E0"
                        strokeWidth={8}
                        className={styles.limitBackground}
                        ifOverflow="extendDomain"
                    />

                    {/* Linha laranja de referência para o limite crítico */}
                    <ReferenceLine
                        x={CRITICAL_STOCK_LIMIT}
                        stroke="#FF9800"
                        strokeWidth={2.5}
                        className={styles.limitLine}
                        isFront={true}
                        ifOverflow="extendDomain"
                        label={{
                            value: 'Limite Crítico',
                            position: 'top',
                            fontSize: 12,
                            fontWeight: "bold",
                            className: styles.limitLabel
                        }}
                    />

                    {/* Linha pontilhada vertical para destacar mais o limite */}
                    <ReferenceLine
                        x={CRITICAL_STOCK_LIMIT}
                        stroke="#FF9800"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        className={styles.limitDottedLine}
                        ifOverflow="extendDomain"
                    />

                    {/* Tooltip personalizado */}
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />

                    {/* Barras de estoque */}          <Bar
                        dataKey="quantidade"
                        name="Estoque"
                        className={styles.barItem}
                        radius={[0, 4, 4, 0]}
                        barSize={BAR_SIZE}
                        isAnimationActive={true}
                        animationDuration={800}
                    >            {enhancedData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.quantidade < CRITICAL_STOCK_LIMIT ? '#f44336' :
                                entry.quantidade === CRITICAL_STOCK_LIMIT ? '#FF9800' : '#61131A'}
                            className={getBarClassName(entry.quantidade)}
                        />
                    ))}
                    </Bar>                </BarChart>
            </ResponsiveContainer>
            <div className={styles.chartLegends}>
                <div className={styles.barLegends}>
                    <div className={styles.barLegendItem}>
                        <span className={styles.barLegendColor} style={{ backgroundColor: '#f44336' }}></span>
                        <span className={styles.legendText}>Abaixo do limite</span>
                    </div>
                    <div className={styles.barLegendItem}>
                        <span className={styles.barLegendColor} style={{ backgroundColor: '#FF9800' }}></span>
                        <span className={styles.legendText}>No limite</span>
                    </div>
                    <div className={styles.barLegendItem}>
                        <span className={styles.barLegendColor} style={{ backgroundColor: '#61131A' }}></span>
                        <span className={styles.legendText}>Acima do limite</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Definição de PropTypes para documentação e validação
LowStockChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            produto: PropTypes.string.isRequired,
            quantidade: PropTypes.number.isRequired
        })
    ).isRequired,
    isMobile: PropTypes.bool.isRequired,
    chartHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

// Exportando componente memoizado para melhor performance
export default memo(LowStockChart);
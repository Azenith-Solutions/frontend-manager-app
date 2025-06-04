import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, ResponsiveContainer, Cell, ReferenceLine, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import styles from './ComponentsPerBoxChart.module.css';

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

    if (item.isNormal) {
        statusColor = '#f44336';
        statusMessage = '⚠️ Acima do limite máximo';
    } else if (item.isCritical) {
        statusColor = '#FF9800';
        statusMessage = '⚠️ Próximo ao limite máximo';
    } else {
        statusColor = '#61131A';
        statusMessage = '✓ Quantidade adequada';
    }

    return (
        <div className={styles.tooltipContainer}>
            <p className={styles.tooltipName}>{item.name}</p>
            <p className={styles.tooltipValue} style={{ color: statusColor }}>
                Componentes: <strong>{item.quantity}</strong>
            </p>
            <p className={styles.tooltipLimit}>
                <span className={styles.tooltipLimitIndicator}></span>
                Limite máximo: <strong>200</strong>
            </p>
            <p className={`${styles.tooltipStatus} ${item.isNormal ? styles.tooltipAlert : item.isCritical ? styles.tooltipWarning : styles.tooltipNormal}`}>
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
 * Componente TinyBarChart para exibir quantidade de componentes por caixa
 * Inclui uma linha de referência para o limite máximo de 200 componentes
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados dos componentes por caixa
 * @param {boolean} props.isMobile - Flag para indicar se está em visualização mobile
 * @param {number} props.chartHeight - Altura do gráfico
 * @returns {JSX.Element} Componente de gráfico de barras simplificado
 */
const ComponentsPerBoxChart = ({ data, isMobile, chartHeight }) => {// Constantes
    const MAX_COMPONENTS_PER_BOX = 200;
    const CHART_MARGINS = { top: 0, right: 0, left: isMobile ? 60 : 75, bottom: 30 };
    const BAR_SIZE = isMobile ? 14 : 20;
    // Encontrar o valor máximo para garantir que a linha seja visível
    const maxValue = useMemo(() => {
        const max = Math.max(...data.map(item => item.componentsPerBox));
        return Math.max(max, MAX_COMPONENTS_PER_BOX + 20); // Garantir espaço para a linha e dar margem
    }, [data, MAX_COMPONENTS_PER_BOX]);
    // Preparar dados para o gráfico usando memoização para performance
    const enhancedData = useMemo(() => {
        return data.map(item => ({
            name: item.title,
            quantity: item.componentsPerBox,
            isLow: item.componentsPerBox < MAX_COMPONENTS_PER_BOX * 0.75, // Abaixo de 75% do limite
            isCritical: item.componentsPerBox >= MAX_COMPONENTS_PER_BOX * 0.75 && item.componentsPerBox <= MAX_COMPONENTS_PER_BOX,
            isNormal: item.componentsPerBox > MAX_COMPONENTS_PER_BOX
        }));
    }, [data, MAX_COMPONENTS_PER_BOX]);
    // Função para determinar a cor da barra baseada no limite de componentes por caixa
    const getBarClassName = (quantity) => {
        if (quantity > MAX_COMPONENTS_PER_BOX) return styles.lowStockBar;
        if (quantity < (MAX_COMPONENTS_PER_BOX - 10)) return styles.normalBar;
        return styles.criticalStockBar;
    }; return (
        <div className={styles.chartContainer} style={{ position: 'relative', paddingBottom: '0px' }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={chartHeight}>
                <BarChart
                    data={enhancedData}
                    layout="vertical"
                    margin={CHART_MARGINS}
                    className={styles.tinyBarChart}
                >
                    {/* Eixos para garantir que a linha de limite seja visível */}
                    <XAxis
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
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />                    {/* Linha laranja de referência para o limite máximo de componentes por caixa */}          {/* Linha de fundo para destacar ainda mais o limite */}
                    <ReferenceLine
                        x={MAX_COMPONENTS_PER_BOX}
                        stroke="#FFF3E0"
                        strokeWidth={8}
                        className={styles.limitBackground}
                        ifOverflow="extendDomain"
                    />

                    {/* Linha laranja de referência para o limite máximo */}
                    <ReferenceLine
                        x={MAX_COMPONENTS_PER_BOX}
                        stroke="#FF9800"
                        strokeWidth={2.5}
                        className={styles.limitLine}
                        isFront={true}
                        ifOverflow="extendDomain"
                        label={{
                            value: 'Limite Máximo',
                            position: 'top',
                            fontSize: 12,
                            fontWeight: "bold",
                            className: styles.limitLabel
                        }}
                    />

                    {/* Linha pontilhada vertical para destacar mais o limite */}
                    <ReferenceLine
                        x={MAX_COMPONENTS_PER_BOX}
                        stroke="#FF9800"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                        className={styles.limitDottedLine}
                        ifOverflow="extendDomain"
                    />                    {/* Tooltip personalizado */}
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                        contentStyle={{
                            fontSize: isMobile ? 12 : 14,
                            backgroundColor: 'rgba(255, 255, 255, 0.97)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            padding: '8px 12px'
                        }}
                    />

                    {/* Barras de estoque */}          <Bar
                        dataKey="quantity"
                        name="Estoque"
                        className={styles.barItem}
                        radius={[0, 4, 4, 0]}
                        barSize={BAR_SIZE}
                        isAnimationActive={true}
                        animationDuration={800}
                    >                    {enhancedData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.quantity < MAX_COMPONENTS_PER_BOX * 0.75 ? '#f44336' :
                                entry.quantity >= MAX_COMPONENTS_PER_BOX * 0.75 && entry.quantity <= MAX_COMPONENTS_PER_BOX ? '#FF9800' : '#61131A'}
                            className={getBarClassName(entry.quantity)}
                        />
                    ))}
                    </Bar>
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconSize={10}
                        iconType="circle"
                        payload={[
                            { value: 'Adequado', type: 'circle', color: '#61131A' },
                            { value: 'Próximo ao limite', type: 'circle', color: '#FF9800' },
                            { value: 'Acima do limite', type: 'circle', color: '#f44336' }
                        ]}
                        formatter={(value) => {
                            // Calcula quantos componentes pertencem a cada categoria
                            const countInCategory = enhancedData.filter(item => {
                                if (value === 'Adequado') return !item.isCritical && !item.isNormal;
                                if (value === 'Próximo ao limite') return item.isCritical;
                                if (value === 'Acima do limite') return item.isNormal;
                                return false;
                            }).length;

                            return (
                                <span style={{
                                    fontSize: isMobile ? '10px' : '11px',
                                    color: '#333',
                                    fontWeight: 500,
                                    display: 'inline-block',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {`${value}: ${countInCategory} ${countInCategory === 1 ? 'caixa' : 'caixas'}`}
                                </span>
                            );
                        }}
                        wrapperStyle={{
                            fontSize: isMobile ? 10 : 11,
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            borderRadius: '0 0 8px 8px',
                            paddingTop: '18px',
                            margin: '0 auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: 10,
                            left: 0,
                            borderTop: '1px solid rgba(0,0,0,0.05)'
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Definição de PropTypes para documentação e validação
ComponentsPerBoxChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            componentsPerBox: PropTypes.number.isRequired
        })
    ).isRequired,
    isMobile: PropTypes.bool.isRequired,
    chartHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

// Exportando componente memoizado para melhor performance
export default memo(ComponentsPerBoxChart);
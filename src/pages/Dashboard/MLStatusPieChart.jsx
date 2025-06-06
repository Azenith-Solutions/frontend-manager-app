import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import styles from './MLStatusPieChart.module.css';

/**
 * Componente para exibição do gráfico de pizza dos componentes anunciados no Mercado Livre
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados dos componentes (anunciados e não anunciados)
 * @param {boolean} props.isMobile - Flag para indicar se está em visualização mobile
 * @param {number} props.chartHeight - Altura do gráfico
 * @returns {JSX.Element} Componente de gráfico de pizza
 */
const MLStatusPieChart = ({ data, isMobile, chartHeight }) => {
    return (
        <div className={styles.chartContainer}>
            <ResponsiveContainer
                width="100%"
                height="100%"
                minHeight={chartHeight}
            >
                <PieChart
                    margin={{ top: 0, right: 0, left: 0, bottom: 30 }}
                >
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props) => {
                            const RADIAN = Math.PI / 180;
                            const { cx, cy, midAngle, outerRadius, percent } = props;

                            // Calcular posição do texto
                            const radius = outerRadius * 0.65;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            // Mostrar percentagem apenas se for maior que 1%
                            if (percent < 0.01) return null;

                            return (
                                <text
                                    x={x}
                                    y={y}
                                    fill="white"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: isMobile ? '12px' : '14px',
                                        textShadow: '0px 0px 3px rgba(0,0,0,0.7)'
                                    }}
                                >
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            );
                        }}
                        outerRadius={isMobile ? 100 : 140}
                        innerRadius={0}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#fff"
                                strokeWidth={0.5}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value, name) => [`${value} unidades`, name]}
                        contentStyle={{
                            fontSize: isMobile ? 12 : 14,
                            backgroundColor: 'rgba(255, 255, 255, 0.97)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            padding: '8px 12px'
                        }}
                        itemStyle={{
                            padding: '4px 0',
                            color: '#333'
                        }}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconSize={10}
                        iconType="circle"
                        formatter={(value, entry) => {
                            const { payload } = entry;
                            const quantity = payload.value;
                            const percent = Math.round(
                                (quantity / data.reduce((sum, item) => sum + item.value, 0)) * 100
                            );

                            return (
                                <span
                                    style={{
                                        fontSize: isMobile ? '10px' : '11px',
                                        color: '#333',
                                        fontWeight: 500,
                                        display: 'inline-block',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {`${value}: ${quantity} unidades - ${percent}%`}
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
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// Definição de PropTypes para documentação e validação
MLStatusPieChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            color: PropTypes.string.isRequired
        })
    ).isRequired,
    isMobile: PropTypes.bool.isRequired,
    chartHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

// Exportando componente memoizado para melhor performance
export default memo(MLStatusPieChart);

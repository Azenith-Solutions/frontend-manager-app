import { api } from '../api';

export const fetchLowStockItems = async () => {
    try {
        const response = await api.get('/components/low-stock');
        console.log('Resposta dos componentes de baixo estoque:', response);

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar componentes de baixo estoque:', error);
        throw error;
    }
}
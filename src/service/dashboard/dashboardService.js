import { api } from '../api';

export const fetchLowStockItems = async () => {
    try {
        const response = await api.get('/components/kpi/low-stock');
        console.log('Resposta dos componentes de baixo estoque:', response);

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar componentes de baixo estoque:', error);
        throw error;
    }
}

export const fetchInObservationItems = async () => {
    try {
        const response = await api.get('/components/kpi/in-observation');
        console.log('Resposta dos componentes em observação:', response);

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar componentes em observação:', error);
        throw error;
    }
}

export const fetchIcompleteItems = async () => {
    try {
        const response = await api.get('/components/kpi/incomplete');

        console.log('Resposta dos componentes incompletos:', response);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar componentes incompletos:', error);
        throw error;
    }
}

export const fetchItemsOutOfLastSaleSLA = async () => {
    try {
        const response = await api.get('/components/kpi/out-of-last-sale-sla');

        console.log('Resposta dos componentes fora do SLA da última venda:', response);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar componentes fora do SLA da última venda:', error);
        throw error;
    }
}

export const fetchQuantityByMLStatus = async () => {
    try {
        const response = await api.get('/components/dashboard/flag-ml');
        console.log('Resposta dos componentes anunciados no ML:', response);

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar componentes anunciados no ML:', error);
        throw error;
    }
}

export const fetchComponentsPerBox = async () => {
    try {
        const response = await api.get('/boxes/kpi/box-dashboard');
        console.log('Resposta dos componentes por caixa:', response);

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar componentes por caixa:', error);
        throw error;
    }
}
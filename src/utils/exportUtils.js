/**
 * Exporta dados para um arquivo CSV e inicia o download
 * 
 * @param {Array} data - Array de objetos a serem exportados
 * @param {Array} headers - Array de objetos com { id, label } para as colunas
 * @param {string} filename - Nome do arquivo a ser baixado
 */
export const exportToCsv = (data, headers, filename) => {
  // Validar entradas
  if (!Array.isArray(data) || !Array.isArray(headers) || !filename) {
    console.error('Parâmetros inválidos para exportação CSV');
    return;
  }

  try {
    // Criar cabeçalho
    let csvContent = headers.map(header => `"${header.label}"`).join(',') + '\n';

    // Adicionar linhas de dados
    data.forEach(item => {
      const row = headers
        .map(header => {
          // Obter o valor com base no ID do cabeçalho
          let value = item[header.id];
          
          // Verificar se é um objeto aninhado com a notação de ponto
          if (header.id.includes('.')) {
            const parts = header.id.split('.');
            let nestedValue = item;
            for (const part of parts) {
              nestedValue = nestedValue?.[part];
              if (nestedValue === undefined || nestedValue === null) break;
            }
            value = nestedValue;
          }
          
          // Tratar valores especiais
          if (value === undefined || value === null) {
            return '""';
          } else if (typeof value === 'object') {
            // Para objetos, tentar JSON.stringify ou toString()
            try {
              value = JSON.stringify(value);
            } catch (e) {
              value = String(value);
            }
          }
          
          // Escapar aspas duplas e envolver em aspas
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',');
        
      csvContent += row + '\n';
    });

    // Criar o blob para o arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Criar link para download
    const link = document.createElement('a');
    
    // Suporte para navegadores mais recentes
    if (navigator.msSaveBlob) {
      // Para IE e Edge
      navigator.msSaveBlob(blob, filename);
    } else {
      // Para outros navegadores
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Liberar recursos
    }
    
    console.log(`Arquivo ${filename} gerado com sucesso!`);
    return true;
  } catch (error) {
    console.error('Erro ao exportar para CSV:', error);
    return false;
  }
};

/**
 * Formata data atual para string usada no nome do arquivo
 * 
 * @returns {string} Data formatada (YYYY-MM-DD)
 */
export const getFormattedDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};
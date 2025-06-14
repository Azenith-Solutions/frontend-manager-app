// Arquivo para função serverless que atua como proxy para o Slack
// Deve ser implantado em um serviço como Netlify Functions, Vercel Functions ou similar

exports.handler = async (event, context) => {
  // Verificar se é método POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  try {
    // Obter dados da requisição
    const payload = JSON.parse(event.body);
    const { text, webhook_url } = payload;

    if (!text || !webhook_url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Parâmetros inválidos' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }

    // Fazer requisição para o Slack
    const response = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Slack respondeu com status ${response.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  } catch (error) {
    console.error('Erro no proxy do Slack:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno do servidor' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }
};
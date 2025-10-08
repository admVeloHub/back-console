// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const express = require('express');
const router = express.Router();
const UserActivity = require('../models/UserActivity');
const BotFeedback = require('../models/BotFeedback');

// Função para calcular datas baseado no período
const calculateDateRange = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case '1dia':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7dias':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30dias':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90dias':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1ano':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'todos':
      startDate = new Date('2020-01-01'); // Data inicial do sistema
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default 30 dias
  }

  return { startDate, endDate: now };
};


// GET /api/bot-analises/dados-completos - Endpoint otimizado único com dados brutos + metadados
router.get('/dados-completos', async (req, res) => {
  try {
    global.emitTraffic('Bot Análises', 'received', 'Entrada recebida - GET /api/bot-analises/dados-completos');
    global.emitLog('info', 'GET /api/bot-analises/dados-completos - Processando dados brutos + metadados');
    
    const { periodo = '30dias', exibicao = 'dia' } = req.query;
    
    // Validar parâmetros
    const validPeriods = ['1dia', '7dias', '30dias', '90dias', '1ano', 'todos'];
    const validDisplays = ['dia', 'semana', 'mes'];
    
    if (!validPeriods.includes(periodo)) {
      global.emitTraffic('Bot Análises', 'error', 'Período inválido');
      global.emitLog('error', 'GET /api/bot-analises/dados-completos - Período inválido');
      return res.status(400).json({
        success: false,
        error: 'Período inválido. Use: 1dia, 7dias, 30dias, 90dias, 1ano, todos'
      });
    }
    
    if (!validDisplays.includes(exibicao)) {
      global.emitTraffic('Bot Análises', 'error', 'Exibição inválida');
      global.emitLog('error', 'GET /api/bot-analises/dados-completos - Exibição inválida');
      return res.status(400).json({
        success: false,
        error: 'Exibição inválida. Use: dia, semana, mes'
      });
    }
    
    global.emitTraffic('Bot Análises', 'processing', 'Calculando período e consultando MongoDB');
    
    // Calcular período
    const { startDate, endDate } = calculateDateRange(periodo);
    
    // Executar consultas em paralelo para otimização - DADOS BRUTOS
    const [
      userActivities,
      botFeedbacks
    ] = await Promise.all([
      // Buscar todos os registros de user_activity no período
      UserActivity.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }).lean(),
      
      // Buscar todos os registros de bot_feedback no período
      BotFeedback.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).lean()
    ]);
    
    // Emitir dados recebidos do MongoDB para JSON Input
    global.emitJsonInput({
      source: 'MongoDB',
      collections: {
        user_activity: {
          count: userActivities.length,
          sample: userActivities.slice(0, 3) // Mostrar apenas 3 registros como exemplo
        },
        bot_feedback: {
          count: botFeedbacks.length,
          sample: botFeedbacks.slice(0, 3) // Mostrar apenas 3 registros como exemplo
        }
      },
      query: {
        periodo: periodo,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      timestamp: new Date().toISOString()
    });
    
    global.emitTraffic('Bot Análises', 'processing', 'Processando metadados e resumos');
    
    // Extrair metadados únicos para filtros dinâmicos
    const agentes = [...new Set(botFeedbacks.map(f => f.colaboradorNome))].filter(Boolean);
    const usuarios = [...new Set(userActivities.map(a => a.userId))].filter(Boolean);
    const tiposAcao = [...new Set(userActivities.map(a => a.action))].filter(Boolean);
    const tiposFeedback = [...new Set(botFeedbacks.map(f => f.details?.feedbackType))].filter(Boolean);
    const sessoes = [...new Set([
      ...userActivities.map(a => a.sessionId),
      ...botFeedbacks.map(f => f.sessionId)
    ])].filter(Boolean);
    
    // Extrair períodos disponíveis nos dados
    const periodosDisponiveis = [];
    const allDates = [
      ...userActivities.map(a => new Date(a.timestamp)),
      ...botFeedbacks.map(f => new Date(f.createdAt))
    ];
    
    if (allDates.length > 0) {
      const minDate = new Date(Math.min(...allDates));
      const maxDate = new Date(Math.max(...allDates));
      
      // Gerar períodos por dia
      const currentDate = new Date(minDate);
      while (currentDate <= maxDate) {
        periodosDisponiveis.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Calcular resumo básico
    const totalRegistros = userActivities.length + botFeedbacks.length;
    const totalUsuarios = usuarios.length;
    const totalSessoes = sessoes.length;
    
    // Montar resposta final com dados brutos + metadados
    const response = {
      success: true,
      dadosBrutos: {
        user_activity: userActivities,
        bot_feedback: botFeedbacks
      },
      metadados: {
        agentes: agentes,
        usuarios: usuarios,
        periodos: periodosDisponiveis,
        tiposAcao: tiposAcao,
        tiposFeedback: tiposFeedback,
        sessoes: sessoes
      },
      resumo: {
        totalRegistros: totalRegistros,
        periodoInicio: startDate.toISOString(),
        periodoFim: endDate.toISOString(),
        totalUsuarios: totalUsuarios,
        totalSessoes: totalSessoes,
        totalUserActivities: userActivities.length,
        totalBotFeedbacks: botFeedbacks.length
      },
      metadata: {
        periodo: periodo,
        exibicao: exibicao,
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        timestamp: new Date().toISOString(),
        versao: '4.0.0'
      }
    };
    
    global.emitTraffic('Bot Análises', 'completed', 'Dados brutos + metadados processados com sucesso');
    global.emitLog('success', `GET /api/bot-analises/dados-completos - ${totalRegistros} registros brutos processados`);
    global.emitJson({
      resumo: response.resumo,
      metadados: response.metadados
    });
    
    res.json(response);
    
  } catch (error) {
    global.emitTraffic('Bot Análises', 'error', 'Erro ao processar dados');
    global.emitLog('error', `GET /api/bot-analises/dados-completos - Erro: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao processar dados'
    });
  }
});

module.exports = router;

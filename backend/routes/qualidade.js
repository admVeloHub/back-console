// VERSION: v3.4.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const express = require('express');
const router = express.Router();
const QualidadeFuncionario = require('../models/QualidadeFuncionario');
const QualidadeAvaliacao = require('../models/QualidadeAvaliacao');
const QualidadeAvaliacaoGPT = require('../models/QualidadeAvaliacaoGPT');

// Middleware de monitoramento
const logRequest = (req, res, next) => {
  console.log(`[QUALIDADE-FUNCIONARIOS] ${new Date().toISOString()} - ${req.method} ${req.path} - RECEIVED`);
  next();
};

const logResponse = (req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[QUALIDADE-FUNCIONARIOS] ${new Date().toISOString()} - ${req.method} ${req.path} - COMPLETED`);
    console.log(`[QUALIDADE-FUNCIONARIOS] Response:`, JSON.stringify(data, null, 2));
    originalSend.call(this, data);
  };
  next();
};

router.use(logRequest);
router.use(logResponse);

// Validação de dados obrigatórios para funcionários
const validateFuncionario = (req, res, next) => {
  const { nomeCompleto, empresa, dataContratado } = req.body;
  
  if (!nomeCompleto || nomeCompleto.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Nome completo é obrigatório'
    });
  }
  
  if (!empresa || empresa.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Empresa é obrigatória'
    });
  }
  
  if (!dataContratado) {
    return res.status(400).json({
      success: false,
      message: 'Data de contratação é obrigatória'
    });
  }
  
  // Validar se dataContratado é uma data válida
  const dataContratadoDate = new Date(dataContratado);
  if (isNaN(dataContratadoDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Data de contratação deve ser uma data válida'
    });
  }
  
  next();
};

// Validação de dados obrigatórios para avaliações
const validateAvaliacao = (req, res, next) => {
  const { colaboradorNome, avaliador, mes, ano, dataAvaliacao } = req.body;
  
  if (!colaboradorNome || colaboradorNome.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Nome do colaborador é obrigatório'
    });
  }
  
  if (!avaliador || avaliador.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Avaliador é obrigatório'
    });
  }
  
  if (!mes || mes.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Mês é obrigatório'
    });
  }
  
  if (!ano || typeof ano !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Ano é obrigatório e deve ser um número'
    });
  }
  
  if (!dataAvaliacao) {
    return res.status(400).json({
      success: false,
      message: 'Data da avaliação é obrigatória'
    });
  }
  
  // Validar se dataAvaliacao é uma data válida
  const dataAvaliacaoDate = new Date(dataAvaliacao);
  if (isNaN(dataAvaliacaoDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Data da avaliação deve ser uma data válida'
    });
  }
  
  next();
};

// Validação de dados obrigatórios para avaliações GPT
const validateAvaliacaoGPT = (req, res, next) => {
  const { avaliacaoId, analiseGPT, pontuacaoGPT, criteriosGPT, confianca } = req.body;
  
  if (!avaliacaoId || avaliacaoId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'ID da avaliação é obrigatório'
    });
  }
  
  if (!analiseGPT || analiseGPT.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Análise GPT é obrigatória'
    });
  }
  
  if (pontuacaoGPT === undefined || pontuacaoGPT === null || typeof pontuacaoGPT !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Pontuação GPT é obrigatória e deve ser um número'
    });
  }
  
  if (pontuacaoGPT < 0 || pontuacaoGPT > 100) {
    return res.status(400).json({
      success: false,
      message: 'Pontuação GPT deve estar entre 0 e 100'
    });
  }
  
  if (!criteriosGPT || typeof criteriosGPT !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Critérios GPT são obrigatórios e devem ser um objeto'
    });
  }
  
  if (confianca === undefined || confianca === null || typeof confianca !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Confiança é obrigatória e deve ser um número'
    });
  }
  
  if (confianca < 0 || confianca > 100) {
    return res.status(400).json({
      success: false,
      message: 'Confiança deve estar entre 0 e 100'
    });
  }
  
  next();
};

// GET /api/qualidade/funcionarios - Listar todos os funcionários
router.get('/funcionarios', async (req, res) => {
  try {
    console.log(`[QUALIDADE-FUNCIONARIOS] ${new Date().toISOString()} - GET /funcionarios - PROCESSING`);
    
    const funcionarios = await QualidadeFuncionario.find({})
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: funcionarios,
      count: funcionarios.length
    });
  } catch (error) {
    console.error('[QUALIDADE-FUNCIONARIOS] Erro ao buscar funcionários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar funcionários'
    });
  }
});

// GET /api/qualidade/funcionarios/ativos - Listar apenas funcionários ativos
router.get('/funcionarios/ativos', async (req, res) => {
  try {
    console.log(`[QUALIDADE-FUNCIONARIOS] ${new Date().toISOString()} - GET /funcionarios/ativos - PROCESSING`);
    
    const funcionariosAtivos = await QualidadeFuncionario.find({
      desligado: false,
      afastado: false
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: funcionariosAtivos,
      count: funcionariosAtivos.length
    });
  } catch (error) {
    console.error('[QUALIDADE-FUNCIONARIOS] Erro ao buscar funcionários ativos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar funcionários ativos'
    });
  }
});

// GET /api/qualidade/funcionarios/:id - Obter funcionário específico por _id
router.get('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-FUNCIONARIOS] ${new Date().toISOString()} - GET /funcionarios/${id} - PROCESSING`);
    
    const funcionario = await QualidadeFuncionario.findById(id);
    
    if (!funcionario) {
      return res.status(404).json({
        success: false,
        message: 'Funcionário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: funcionario
    });
  } catch (error) {
    console.error('[QUALIDADE-FUNCIONARIOS] Erro ao buscar funcionário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar funcionário'
    });
  }
});

// POST /api/qualidade/funcionarios - Criar novo funcionário
router.post('/funcionarios', validateFuncionario, async (req, res) => {
  try {
    global.emitTraffic('Qualidade Funcionários', 'received', 'Entrada recebida - POST /api/qualidade/funcionarios');
    global.emitLog('info', 'POST /api/qualidade/funcionarios - Criando novo funcionário');
    global.emitJson(req.body);
    
    const funcionarioData = { ...req.body };
    
    // Converter datas se fornecidas como strings
    if (funcionarioData.dataAniversario) {
      funcionarioData.dataAniversario = new Date(funcionarioData.dataAniversario);
    }
    if (funcionarioData.dataContratado) {
      funcionarioData.dataContratado = new Date(funcionarioData.dataContratado);
    }
    if (funcionarioData.dataDesligamento) {
      funcionarioData.dataDesligamento = new Date(funcionarioData.dataDesligamento);
    }
    if (funcionarioData.dataAfastamento) {
      funcionarioData.dataAfastamento = new Date(funcionarioData.dataAfastamento);
    }
    
    global.emitTraffic('Qualidade Funcionários', 'processing', 'Transmitindo para DB');
    const novoFuncionario = new QualidadeFuncionario(funcionarioData);
    const funcionarioSalvo = await novoFuncionario.save();
    
    global.emitTraffic('Qualidade Funcionários', 'completed', 'Concluído - Funcionário criado com sucesso');
    global.emitLog('success', `POST /api/qualidade/funcionarios - Funcionário "${funcionarioSalvo.nomeCompleto}" criado com sucesso`);
    global.emitJson(funcionarioSalvo);
    
    res.status(201).json({
      success: true,
      data: funcionarioSalvo,
      message: 'Funcionário criado com sucesso'
    });
  } catch (error) {
    global.emitTraffic('Qualidade Funcionários', 'error', 'Erro ao criar funcionário');
    global.emitLog('error', `POST /api/qualidade/funcionarios - Erro: ${error.message}`);
    console.error('[QUALIDADE-FUNCIONARIOS] Erro ao criar funcionário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar funcionário'
    });
  }
});

// PUT /api/qualidade/funcionarios/:id - Atualizar funcionário existente
router.put('/funcionarios/:id', validateFuncionario, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-FUNCIONARIOS] ${new Date().toISOString()} - PUT /funcionarios/${id} - PROCESSING`);
    console.log(`[QUALIDADE-FUNCIONARIOS] Request body:`, JSON.stringify(req.body, null, 2));
    
    // Verificar se funcionário existe
    const funcionarioExistente = await QualidadeFuncionario.findById(id);
    if (!funcionarioExistente) {
      return res.status(404).json({
        success: false,
        message: 'Funcionário não encontrado'
      });
    }
    
    // Converter datas se fornecidas como strings
    const updateData = { ...req.body };
    if (updateData.dataAniversario) {
      updateData.dataAniversario = new Date(updateData.dataAniversario);
    }
    if (updateData.dataContratado) {
      updateData.dataContratado = new Date(updateData.dataContratado);
    }
    if (updateData.dataDesligamento) {
      updateData.dataDesligamento = new Date(updateData.dataDesligamento);
    }
    if (updateData.dataAfastamento) {
      updateData.dataAfastamento = new Date(updateData.dataAfastamento);
    }
    
    const funcionarioAtualizado = await QualidadeFuncionario.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: funcionarioAtualizado,
      message: 'Funcionário atualizado com sucesso'
    });
  } catch (error) {
    console.error('[QUALIDADE-FUNCIONARIOS] Erro ao atualizar funcionário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar funcionário'
    });
  }
});

// DELETE /api/qualidade/funcionarios/:id - Deletar funcionário
router.delete('/funcionarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-FUNCIONARIOS] ${new Date().toISOString()} - DELETE /funcionarios/${id} - PROCESSING`);
    
    const funcionarioDeletado = await QualidadeFuncionario.findByIdAndDelete(id);
    
    if (!funcionarioDeletado) {
      return res.status(404).json({
        success: false,
        message: 'Funcionário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: funcionarioDeletado,
      message: 'Funcionário deletado com sucesso'
    });
  } catch (error) {
    console.error('[QUALIDADE-FUNCIONARIOS] Erro ao deletar funcionário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao deletar funcionário'
    });
  }
});

// ==================== ENDPOINTS DE AVALIAÇÕES ====================

// GET /api/qualidade/avaliacoes - Listar todas as avaliações
router.get('/avaliacoes', async (req, res) => {
  try {
    console.log(`[QUALIDADE-AVALIACOES] ${new Date().toISOString()} - GET /avaliacoes - PROCESSING`);
    
    const avaliacoes = await QualidadeAvaliacao.find({})
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: avaliacoes,
      count: avaliacoes.length
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES] Erro ao buscar avaliações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar avaliações'
    });
  }
});

// GET /api/qualidade/avaliacoes/:id - Obter avaliação específica por _id
router.get('/avaliacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-AVALIACOES] ${new Date().toISOString()} - GET /avaliacoes/${id} - PROCESSING`);
    
    const avaliacao = await QualidadeAvaliacao.findById(id);
    
    if (!avaliacao) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: avaliacao
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES] Erro ao buscar avaliação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar avaliação'
    });
  }
});

// POST /api/qualidade/avaliacoes - Criar nova avaliação
router.post('/avaliacoes', validateAvaliacao, async (req, res) => {
  try {
    global.emitTraffic('Qualidade Avaliações', 'received', 'Entrada recebida - POST /api/qualidade/avaliacoes');
    global.emitLog('info', 'POST /api/qualidade/avaliacoes - Criando nova avaliação');
    global.emitJson(req.body);
    
    const avaliacaoData = { ...req.body };
    
    // Converter data se fornecida como string
    if (avaliacaoData.dataAvaliacao) {
      avaliacaoData.dataAvaliacao = new Date(avaliacaoData.dataAvaliacao);
    }
    
    global.emitTraffic('Qualidade Avaliações', 'processing', 'Transmitindo para DB');
    const novaAvaliacao = new QualidadeAvaliacao(avaliacaoData);
    const avaliacaoSalva = await novaAvaliacao.save();
    
    global.emitTraffic('Qualidade Avaliações', 'completed', 'Concluído - Avaliação criada com sucesso');
    global.emitLog('success', `POST /api/qualidade/avaliacoes - Avaliação do colaborador "${avaliacaoSalva.colaboradorNome}" criada com sucesso`);
    global.emitJson(avaliacaoSalva);
    
    res.status(201).json({
      success: true,
      data: avaliacaoSalva,
      message: 'Avaliação criada com sucesso'
    });
  } catch (error) {
    global.emitTraffic('Qualidade Avaliações', 'error', 'Erro ao criar avaliação');
    global.emitLog('error', `POST /api/qualidade/avaliacoes - Erro: ${error.message}`);
    console.error('[QUALIDADE-AVALIACOES] Erro ao criar avaliação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar avaliação'
    });
  }
});

// PUT /api/qualidade/avaliacoes/:id - Atualizar avaliação existente
router.put('/avaliacoes/:id', validateAvaliacao, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-AVALIACOES] ${new Date().toISOString()} - PUT /avaliacoes/${id} - PROCESSING`);
    console.log(`[QUALIDADE-AVALIACOES] Request body:`, JSON.stringify(req.body, null, 2));
    
    // Verificar se avaliação existe
    const avaliacaoExistente = await QualidadeAvaliacao.findById(id);
    if (!avaliacaoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada'
      });
    }
    
    // Converter data se fornecida como string
    const updateData = { ...req.body };
    if (updateData.dataAvaliacao) {
      updateData.dataAvaliacao = new Date(updateData.dataAvaliacao);
    }
    
    const avaliacaoAtualizada = await QualidadeAvaliacao.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: avaliacaoAtualizada,
      message: 'Avaliação atualizada com sucesso'
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES] Erro ao atualizar avaliação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar avaliação'
    });
  }
});

// DELETE /api/qualidade/avaliacoes/:id - Deletar avaliação
router.delete('/avaliacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-AVALIACOES] ${new Date().toISOString()} - DELETE /avaliacoes/${id} - PROCESSING`);
    
    const avaliacaoDeletada = await QualidadeAvaliacao.findByIdAndDelete(id);
    
    if (!avaliacaoDeletada) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: avaliacaoDeletada,
      message: 'Avaliação deletada com sucesso'
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES] Erro ao deletar avaliação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao deletar avaliação'
    });
  }
});

// ==================== ENDPOINTS DE AVALIAÇÕES GPT ====================

// GET /api/qualidade/avaliacoes-gpt - Listar todas as avaliações GPT
router.get('/avaliacoes-gpt', async (req, res) => {
  try {
    console.log(`[QUALIDADE-AVALIACOES-GPT] ${new Date().toISOString()} - GET /avaliacoes-gpt - PROCESSING`);
    
    const { avaliacaoId } = req.query;
    let query = {};
    
    if (avaliacaoId) {
      query.avaliacaoId = avaliacaoId;
    }
    
    const avaliacoesGPT = await QualidadeAvaliacaoGPT.find(query)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: avaliacoesGPT,
      count: avaliacoesGPT.length
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES-GPT] Erro ao buscar avaliações GPT:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar avaliações GPT'
    });
  }
});

// GET /api/qualidade/avaliacoes-gpt/:id - Obter avaliação GPT específica por _id
router.get('/avaliacoes-gpt/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-AVALIACOES-GPT] ${new Date().toISOString()} - GET /avaliacoes-gpt/${id} - PROCESSING`);
    
    const avaliacaoGPT = await QualidadeAvaliacaoGPT.findById(id);
    
    if (!avaliacaoGPT) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação GPT não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: avaliacaoGPT
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES-GPT] Erro ao buscar avaliação GPT:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar avaliação GPT'
    });
  }
});

// GET /api/qualidade/avaliacoes-gpt/avaliacao/:avaliacaoId - Obter avaliação GPT por ID da avaliação original
router.get('/avaliacoes-gpt/avaliacao/:avaliacaoId', async (req, res) => {
  try {
    const { avaliacaoId } = req.params;
    console.log(`[QUALIDADE-AVALIACOES-GPT] ${new Date().toISOString()} - GET /avaliacoes-gpt/avaliacao/${avaliacaoId} - PROCESSING`);
    
    const avaliacaoGPT = await QualidadeAvaliacaoGPT.findOne({ avaliacaoId });
    
    if (!avaliacaoGPT) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação GPT não encontrada para esta avaliação'
      });
    }
    
    res.json({
      success: true,
      data: avaliacaoGPT
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES-GPT] Erro ao buscar avaliação GPT por avaliacaoId:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao buscar avaliação GPT'
    });
  }
});

// POST /api/qualidade/avaliacoes-gpt - Criar nova avaliação GPT
router.post('/avaliacoes-gpt', validateAvaliacaoGPT, async (req, res) => {
  try {
    global.emitTraffic('Qualidade Avaliações GPT', 'received', 'Entrada recebida - POST /api/qualidade/avaliacoes-gpt');
    global.emitLog('info', 'POST /api/qualidade/avaliacoes-gpt - Criando nova avaliação GPT');
    global.emitJson(req.body);
    
    const avaliacaoGPTData = { ...req.body };
    
    // Verificar se já existe uma avaliação GPT para este avaliacaoId
    const avaliacaoExistente = await QualidadeAvaliacaoGPT.findOne({ 
      avaliacaoId: avaliacaoGPTData.avaliacaoId 
    });
    
    if (avaliacaoExistente) {
      global.emitTraffic('Qualidade Avaliações GPT', 'error', 'Avaliação GPT já existe para esta avaliação');
      global.emitLog('error', 'POST /api/qualidade/avaliacoes-gpt - Avaliação GPT já existe');
      return res.status(409).json({
        success: false,
        message: 'Já existe uma avaliação GPT para esta avaliação'
      });
    }
    
    global.emitTraffic('Qualidade Avaliações GPT', 'processing', 'Transmitindo para DB');
    const novaAvaliacaoGPT = new QualidadeAvaliacaoGPT(avaliacaoGPTData);
    const avaliacaoGPTSalva = await novaAvaliacaoGPT.save();
    
    global.emitTraffic('Qualidade Avaliações GPT', 'completed', 'Concluído - Avaliação GPT criada com sucesso');
    global.emitLog('success', `POST /api/qualidade/avaliacoes-gpt - Avaliação GPT para ID "${avaliacaoGPTSalva.avaliacaoId}" criada com sucesso`);
    global.emitJson(avaliacaoGPTSalva);
    
    res.status(201).json({
      success: true,
      data: avaliacaoGPTSalva,
      message: 'Avaliação GPT criada com sucesso'
    });
  } catch (error) {
    global.emitTraffic('Qualidade Avaliações GPT', 'error', 'Erro ao criar avaliação GPT');
    global.emitLog('error', `POST /api/qualidade/avaliacoes-gpt - Erro: ${error.message}`);
    console.error('[QUALIDADE-AVALIACOES-GPT] Erro ao criar avaliação GPT:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao criar avaliação GPT'
    });
  }
});

// PUT /api/qualidade/avaliacoes-gpt/:id - Atualizar avaliação GPT existente
router.put('/avaliacoes-gpt/:id', validateAvaliacaoGPT, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-AVALIACOES-GPT] ${new Date().toISOString()} - PUT /avaliacoes-gpt/${id} - PROCESSING`);
    console.log(`[QUALIDADE-AVALIACOES-GPT] Request body:`, JSON.stringify(req.body, null, 2));
    
    // Verificar se avaliação GPT existe
    const avaliacaoGPTExistente = await QualidadeAvaliacaoGPT.findById(id);
    if (!avaliacaoGPTExistente) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação GPT não encontrada'
      });
    }
    
    // Verificar se o avaliacaoId está sendo alterado e se já existe outro registro com esse ID
    const updateData = { ...req.body };
    if (updateData.avaliacaoId && updateData.avaliacaoId !== avaliacaoGPTExistente.avaliacaoId) {
      const avaliacaoComMesmoId = await QualidadeAvaliacaoGPT.findOne({ 
        avaliacaoId: updateData.avaliacaoId,
        _id: { $ne: id }
      });
      
      if (avaliacaoComMesmoId) {
        return res.status(409).json({
          success: false,
          message: 'Já existe uma avaliação GPT para este avaliacaoId'
        });
      }
    }
    
    const avaliacaoGPTAtualizada = await QualidadeAvaliacaoGPT.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: avaliacaoGPTAtualizada,
      message: 'Avaliação GPT atualizada com sucesso'
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES-GPT] Erro ao atualizar avaliação GPT:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao atualizar avaliação GPT'
    });
  }
});

// DELETE /api/qualidade/avaliacoes-gpt/:id - Deletar avaliação GPT
router.delete('/avaliacoes-gpt/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[QUALIDADE-AVALIACOES-GPT] ${new Date().toISOString()} - DELETE /avaliacoes-gpt/${id} - PROCESSING`);
    
    const avaliacaoGPTDeletada = await QualidadeAvaliacaoGPT.findByIdAndDelete(id);
    
    if (!avaliacaoGPTDeletada) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação GPT não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: avaliacaoGPTDeletada,
      message: 'Avaliação GPT deletada com sucesso'
    });
  } catch (error) {
    console.error('[QUALIDADE-AVALIACOES-GPT] Erro ao deletar avaliação GPT:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao deletar avaliação GPT'
    });
  }
});

module.exports = router;

// VERSION: v1.1.0 | DATE: 2024-12-19 | AUTHOR: Lucas Gravina - VeloHub Development Team

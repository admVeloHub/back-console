// VERSION: v2.3.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const express = require('express');
const router = express.Router();
const ModuleStatus = require('../models/ModuleStatus');

// GET /api/module-status - Buscar status atual de todos os módulos
router.get('/', async (req, res) => {
  try {
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'received', 'Entrada recebida - GET /api/module-status');
    }
    if (global.emitLog) {
      global.emitLog('info', 'GET /api/module-status - Buscando status de todos os módulos');
    }
    
    // Buscar o documento único de status (ou criar se não existir)
    let statusDoc = await ModuleStatus.findOne({});
    
    // Se não existir, criar documento padrão
    if (!statusDoc) {
      if (global.emitTraffic) {
        global.emitTraffic('ModuleStatus', 'processing', 'Criando documento padrão no MongoDB');
      }
      statusDoc = new ModuleStatus({});
      await statusDoc.save();
    } else {
      if (global.emitTraffic) {
        global.emitTraffic('ModuleStatus', 'processing', 'Consultando documento existente no MongoDB');
      }
    }
    
    // Mapear campos do schema para nomes do frontend
    const data = {
      'credito-trabalhador': statusDoc._trabalhador,
      'credito-pessoal': statusDoc._pessoal,
      'antecipacao': statusDoc._antecipacao,
      'pagamento-antecipado': statusDoc._pgtoAntecip,
      'modulo-irpf': statusDoc._irpf,
      'modulo-seguro': statusDoc._seguro
    };
    
    const result = {
      success: true,
      data: data
    };
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'completed', `Status de ${Object.keys(data).length} módulos obtidos`);
    }
    
    if (global.emitJson) {
      global.emitJson(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar status dos módulos:', error);
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'error', error.message);
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/module-status - Atualizar status de um módulo específico
router.post('/', async (req, res) => {
  try {
    const { moduleKey, status, updatedBy } = req.body;
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'received', `Entrada recebida - POST /api/module-status - ${moduleKey}: ${status}`);
    }
    if (global.emitLog) {
      global.emitLog('info', `POST /api/module-status - Atualizando módulo ${moduleKey} para ${status}`);
    }
    if (global.emitJson) {
      global.emitJson({ moduleKey, status, updatedBy });
    }
    
    // Validações básicas
    if (!moduleKey || !status) {
      return res.status(400).json({
        success: false,
        error: 'moduleKey e status são obrigatórios'
      });
    }
    
    const validKeys = ['credito-trabalhador', 'credito-pessoal', 'antecipacao', 'pagamento-antecipado', 'modulo-irpf', 'modulo-seguro'];
    const validStatuses = ['on', 'off', 'revisao'];
    
    if (!validKeys.includes(moduleKey)) {
      return res.status(400).json({
        success: false,
        error: 'moduleKey inválido. Deve ser um dos: ' + validKeys.join(', ')
      });
    }
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'status deve ser: on, off ou revisao'
      });
    }
    
    // Mapear moduleKey para campo do schema
    const fieldMapping = {
      'credito-trabalhador': '_trabalhador',
      'credito-pessoal': '_pessoal',
      'antecipacao': '_antecipacao',
      'pagamento-antecipado': '_pgtoAntecip',
      'modulo-irpf': '_irpf',
      'modulo-seguro': '_seguro'
    };
    
    const fieldName = fieldMapping[moduleKey];
    const updateData = { [fieldName]: status };
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'processing', `Atualizando campo ${fieldName} no MongoDB`);
    }
    
    // Atualizar ou criar documento único
    const updatedModule = await ModuleStatus.findOneAndUpdate(
      {},
      updateData,
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );
    
    console.log(`Status do módulo ${moduleKey} atualizado para ${status}${updatedBy ? ` por ${updatedBy}` : ''}`);
    
    const responseData = {
      success: true,
      message: `Status do ${moduleKey} atualizado para ${status}`,
      data: {
        moduleKey: moduleKey,
        status: status,
        updatedAt: updatedModule.updatedAt
      }
    };
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'completed', `Módulo ${moduleKey} atualizado para ${status}`);
    }
    
    if (global.emitJson) {
      global.emitJson(responseData);
    }
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error);
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'error', error.message);
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/module-status - Atualizar múltiplos módulos de uma vez
router.put('/', async (req, res) => {
  try {
    const modules = req.body;
    const updatedBy = modules.updatedBy || null;
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'received', `Entrada recebida - PUT /api/module-status - ${Object.keys(modules).length} módulos`);
    }
    if (global.emitLog) {
      global.emitLog('info', `PUT /api/module-status - Atualizando ${Object.keys(modules).length} módulos`);
    }
    if (global.emitJson) {
      global.emitJson(modules);
    }
    
    // Remover updatedBy do objeto de módulos se presente
    delete modules.updatedBy;
    
    if (!modules || Object.keys(modules).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Dados dos módulos são obrigatórios'
      });
    }
    
    const validKeys = ['credito-trabalhador', 'credito-pessoal', 'antecipacao', 'pagamento-antecipado', 'modulo-irpf', 'modulo-seguro'];
    const validStatuses = ['on', 'off', 'revisao'];
    
    // Mapear moduleKey para campo do schema
    const fieldMapping = {
      'credito-trabalhador': '_trabalhador',
      'credito-pessoal': '_pessoal',
      'antecipacao': '_antecipacao',
      'pagamento-antecipado': '_pgtoAntecip',
      'modulo-irpf': '_irpf',
      'modulo-seguro': '_seguro'
    };
    
    // Validar todos os dados antes de fazer qualquer atualização
    for (const [moduleKey, status] of Object.entries(modules)) {
      if (!validKeys.includes(moduleKey)) {
        return res.status(400).json({
          success: false,
          error: `moduleKey inválido: ${moduleKey}. Deve ser um dos: ${validKeys.join(', ')}`
        });
      }
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `status inválido para ${moduleKey}: ${status}. Deve ser: ${validStatuses.join(', ')}`
        });
      }
    }
    
    // Preparar dados de atualização
    const updateData = {};
    const results = [];
    
    for (const [moduleKey, status] of Object.entries(modules)) {
      const fieldName = fieldMapping[moduleKey];
      updateData[fieldName] = status;
      results.push({
        moduleKey: moduleKey,
        status: status
      });
    }
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'processing', `Atualizando ${Object.keys(updateData).length} campos no MongoDB`);
    }
    
    // Atualizar documento único com todos os campos
    const updatedModule = await ModuleStatus.findOneAndUpdate(
      {},
      updateData,
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );
    
    console.log(`Múltiplos módulos atualizados: ${Object.keys(modules).length} módulos${updatedBy ? ` por ${updatedBy}` : ''}`);
    
    const responseData = {
      success: true,
      message: `${Object.keys(modules).length} módulos atualizados com sucesso`,
      data: modules
    };
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'completed', `${Object.keys(modules).length} módulos atualizados`);
    }
    
    if (global.emitJson) {
      global.emitJson(responseData);
    }
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Erro ao atualizar múltiplos módulos:', error);
    
    if (global.emitTraffic) {
      global.emitTraffic('ModuleStatus', 'error', error.message);
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

// VERSION: v1.1.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const express = require('express');
const router = express.Router();
const ModuleStatus = require('../models/ModuleStatus');

// GET /api/module-status - Buscar status atual de todos os módulos
router.get('/', async (req, res) => {
  try {
    const statuses = await ModuleStatus.find({}).select('-__v -_id -createdAt -updatedAt');
    
    // Transformar array em objeto com moduleKey como chave
    const result = {};
    statuses.forEach(item => {
      result[item.moduleKey] = item.status;
    });
    
    // Garantir que todos os 5 módulos estejam presentes
    const allModules = ['credito-trabalhador', 'credito-pessoal', 'antecipacao', 'pagamento-antecipado', 'modulo-irpf'];
    allModules.forEach(moduleKey => {
      if (!result[moduleKey]) {
        result[moduleKey] = 'off'; // Status padrão
      }
    });
    
    if (global.emitTraffic) {
      global.emitTraffic('GET /api/module-status', 'SUCCESS', `Status de ${Object.keys(result).length} módulos obtidos`);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar status dos módulos:', error);
    
    if (global.emitTraffic) {
      global.emitTraffic('GET /api/module-status', 'ERROR', error.message);
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
    
    // Validações básicas
    if (!moduleKey || !status) {
      return res.status(400).json({
        success: false,
        error: 'moduleKey e status são obrigatórios'
      });
    }
    
    const validKeys = ['credito-trabalhador', 'credito-pessoal', 'antecipacao', 'pagamento-antecipado', 'modulo-irpf'];
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
    
    // Atualizar ou criar
    const updatedModule = await ModuleStatus.findOneAndUpdate(
      { moduleKey },
      { 
        status, 
        updatedAt: new Date(),
        updatedBy: updatedBy || null
      },
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );
    
    console.log(`Status do módulo ${moduleKey} atualizado para ${status}${updatedBy ? ` por ${updatedBy}` : ''}`);
    
    if (global.emitTraffic) {
      global.emitTraffic('POST /api/module-status', 'SUCCESS', `Módulo ${moduleKey} atualizado para ${status}`);
    }
    
    res.json({
      success: true,
      message: `Status do ${moduleKey} atualizado para ${status}`,
      data: {
        moduleKey: updatedModule.moduleKey,
        status: updatedModule.status,
        updatedAt: updatedModule.updatedAt,
        updatedBy: updatedModule.updatedBy
      }
    });
    
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error);
    
    if (global.emitTraffic) {
      global.emitTraffic('POST /api/module-status', 'ERROR', error.message);
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
    
    // Remover updatedBy do objeto de módulos se presente
    delete modules.updatedBy;
    
    if (!modules || Object.keys(modules).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Dados dos módulos são obrigatórios'
      });
    }
    
    const validKeys = ['credito-trabalhador', 'credito-pessoal', 'antecipacao', 'pagamento-antecipado', 'modulo-irpf'];
    const validStatuses = ['on', 'off', 'revisao'];
    const results = [];
    
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
    
    // Atualizar todos os módulos
    for (const [moduleKey, status] of Object.entries(modules)) {
      const updatedModule = await ModuleStatus.findOneAndUpdate(
        { moduleKey },
        { 
          status, 
          updatedAt: new Date(),
          updatedBy: updatedBy || null
        },
        { 
          upsert: true, 
          new: true, 
          runValidators: true 
        }
      );
      
      results.push({
        moduleKey: updatedModule.moduleKey,
        status: updatedModule.status,
        updatedAt: updatedModule.updatedAt
      });
    }
    
    console.log(`Múltiplos módulos atualizados: ${Object.keys(modules).length} módulos${updatedBy ? ` por ${updatedBy}` : ''}`);
    
    if (global.emitTraffic) {
      global.emitTraffic('PUT /api/module-status', 'SUCCESS', `${Object.keys(modules).length} módulos atualizados`);
    }
    
    res.json({
      success: true,
      message: `${Object.keys(modules).length} módulos atualizados com sucesso`,
      data: results
    });
    
  } catch (error) {
    console.error('Erro ao atualizar múltiplos módulos:', error);
    
    if (global.emitTraffic) {
      global.emitTraffic('PUT /api/module-status', 'ERROR', error.message);
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

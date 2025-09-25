// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const express = require('express');
const router = express.Router();
const TkConteudos = require('../models/TkConteudos');

// GET /api/tk-conteudos - Listar todos os conteúdos
router.get('/', async (req, res) => {
  try {
    global.emitTraffic('TkConteudos', 'received', 'Entrada recebida - GET /api/tk-conteudos');
    global.emitLog('info', 'GET /api/tk-conteudos - Listando todos os conteúdos');
    
    const result = await TkConteudos.getAll();
    
    global.emitTraffic('TkConteudos', 'processing', 'Transmitindo para DB console_chamados');
    global.emitJson(result);
    
    global.emitTraffic('TkConteudos', 'completed', 'Concluído - Conteúdos listados com sucesso');
    global.emitLog('success', `GET /api/tk-conteudos - ${result.count} conteúdos encontrados`);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkConteudos', 'error', 'Erro ao listar conteúdos');
    global.emitLog('error', `GET /api/tk-conteudos - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-conteudos/:id - Obter conteúdo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    global.emitTraffic('TkConteudos', 'received', `Entrada recebida - GET /api/tk-conteudos/${id}`);
    global.emitLog('info', `GET /api/tk-conteudos/${id} - Obtendo conteúdo por ID`);
    global.emitJson({ id });
    
    global.emitTraffic('TkConteudos', 'processing', 'Transmitindo para DB console_chamados');
    const result = await TkConteudos.getById(id);
    
    if (result.success) {
      global.emitTraffic('TkConteudos', 'completed', 'Concluído - Conteúdo obtido com sucesso');
      global.emitLog('success', `GET /api/tk-conteudos/${id} - Conteúdo encontrado`);
      global.emitJson(result);
      res.json(result);
    } else {
      global.emitTraffic('TkConteudos', 'error', result.error);
      global.emitLog('error', `GET /api/tk-conteudos/${id} - ${result.error}`);
      res.status(result.error === 'Conteúdo não encontrado' ? 404 : 500).json(result);
    }
  } catch (error) {
    global.emitTraffic('TkConteudos', 'error', 'Erro interno do servidor');
    global.emitLog('error', `GET /api/tk-conteudos/:id - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-conteudos/direcionamento/:direcionamento - Buscar por direcionamento
router.get('/direcionamento/:direcionamento', async (req, res) => {
  try {
    const { direcionamento } = req.params;
    
    global.emitTraffic('TkConteudos', 'received', `Entrada recebida - GET /api/tk-conteudos/direcionamento/${direcionamento}`);
    global.emitLog('info', `GET /api/tk-conteudos/direcionamento/${direcionamento} - Buscando por direcionamento`);
    global.emitJson({ direcionamento });
    
    global.emitTraffic('TkConteudos', 'processing', 'Transmitindo para DB console_chamados');
    const result = await TkConteudos.getByDirecionamento(direcionamento);
    
    global.emitTraffic('TkConteudos', 'completed', 'Concluído - Busca por direcionamento realizada');
    global.emitLog('success', `GET /api/tk-conteudos/direcionamento/${direcionamento} - ${result.count} conteúdos encontrados`);
    global.emitJson(result);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkConteudos', 'error', 'Erro ao buscar por direcionamento');
    global.emitLog('error', `GET /api/tk-conteudos/direcionamento/:direcionamento - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-conteudos/stats/count - Contar conteúdos
router.get('/stats/count', async (req, res) => {
  try {
    global.emitTraffic('TkConteudos', 'received', 'Entrada recebida - GET /api/tk-conteudos/stats/count');
    global.emitLog('info', 'GET /api/tk-conteudos/stats/count - Contando conteúdos');
    
    const result = await TkConteudos.count();
    
    global.emitTraffic('TkConteudos', 'processing', 'Transmitindo para DB console_chamados');
    global.emitJson(result);
    
    global.emitTraffic('TkConteudos', 'completed', 'Concluído - Contagem realizada');
    global.emitLog('success', `GET /api/tk-conteudos/stats/count - ${result.count} conteúdos total`);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkConteudos', 'error', 'Erro ao contar conteúdos');
    global.emitLog('error', `GET /api/tk-conteudos/stats/count - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;

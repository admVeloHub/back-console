// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const express = require('express');
const router = express.Router();
const TkGestao = require('../models/TkGestao');

// GET /api/tk-gestao - Listar todas as gestões
router.get('/', async (req, res) => {
  try {
    global.emitTraffic('TkGestao', 'received', 'Entrada recebida - GET /api/tk-gestao');
    global.emitLog('info', 'GET /api/tk-gestao - Listando todas as gestões');
    
    const result = await TkGestao.getAll();
    
    global.emitTraffic('TkGestao', 'processing', 'Transmitindo para DB console_chamados');
    global.emitJson(result);
    
    global.emitTraffic('TkGestao', 'completed', 'Concluído - Gestões listadas com sucesso');
    global.emitLog('success', `GET /api/tk-gestao - ${result.count} gestões encontradas`);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkGestao', 'error', 'Erro ao listar gestões');
    global.emitLog('error', `GET /api/tk-gestao - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-gestao/:id - Obter gestão por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    global.emitTraffic('TkGestao', 'received', `Entrada recebida - GET /api/tk-gestao/${id}`);
    global.emitLog('info', `GET /api/tk-gestao/${id} - Obtendo gestão por ID`);
    global.emitJson({ id });
    
    global.emitTraffic('TkGestao', 'processing', 'Transmitindo para DB console_chamados');
    const result = await TkGestao.getById(id);
    
    if (result.success) {
      global.emitTraffic('TkGestao', 'completed', 'Concluído - Gestão obtida com sucesso');
      global.emitLog('success', `GET /api/tk-gestao/${id} - Gestão encontrada`);
      global.emitJson(result);
      res.json(result);
    } else {
      global.emitTraffic('TkGestao', 'error', result.error);
      global.emitLog('error', `GET /api/tk-gestao/${id} - ${result.error}`);
      res.status(result.error === 'Gestão não encontrada' ? 404 : 500).json(result);
    }
  } catch (error) {
    global.emitTraffic('TkGestao', 'error', 'Erro interno do servidor');
    global.emitLog('error', `GET /api/tk-gestao/:id - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-gestao/genero/:genero - Buscar por gênero
router.get('/genero/:genero', async (req, res) => {
  try {
    const { genero } = req.params;
    
    global.emitTraffic('TkGestao', 'received', `Entrada recebida - GET /api/tk-gestao/genero/${genero}`);
    global.emitLog('info', `GET /api/tk-gestao/genero/${genero} - Buscando por gênero`);
    global.emitJson({ genero });
    
    global.emitTraffic('TkGestao', 'processing', 'Transmitindo para DB console_chamados');
    const result = await TkGestao.getByGenero(genero);
    
    global.emitTraffic('TkGestao', 'completed', 'Concluído - Busca por gênero realizada');
    global.emitLog('success', `GET /api/tk-gestao/genero/${genero} - ${result.count} gestões encontradas`);
    global.emitJson(result);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkGestao', 'error', 'Erro ao buscar por gênero');
    global.emitLog('error', `GET /api/tk-gestao/genero/:genero - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-gestao/tipo/:tipo - Buscar por tipo
router.get('/tipo/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;
    
    global.emitTraffic('TkGestao', 'received', `Entrada recebida - GET /api/tk-gestao/tipo/${tipo}`);
    global.emitLog('info', `GET /api/tk-gestao/tipo/${tipo} - Buscando por tipo`);
    global.emitJson({ tipo });
    
    global.emitTraffic('TkGestao', 'processing', 'Transmitindo para DB console_chamados');
    const result = await TkGestao.getByTipo(tipo);
    
    global.emitTraffic('TkGestao', 'completed', 'Concluído - Busca por tipo realizada');
    global.emitLog('success', `GET /api/tk-gestao/tipo/${tipo} - ${result.count} gestões encontradas`);
    global.emitJson(result);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkGestao', 'error', 'Erro ao buscar por tipo');
    global.emitLog('error', `GET /api/tk-gestao/tipo/:tipo - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-gestao/direcionamento/:direcionamento - Buscar por direcionamento
router.get('/direcionamento/:direcionamento', async (req, res) => {
  try {
    const { direcionamento } = req.params;
    
    global.emitTraffic('TkGestao', 'received', `Entrada recebida - GET /api/tk-gestao/direcionamento/${direcionamento}`);
    global.emitLog('info', `GET /api/tk-gestao/direcionamento/${direcionamento} - Buscando por direcionamento`);
    global.emitJson({ direcionamento });
    
    global.emitTraffic('TkGestao', 'processing', 'Transmitindo para DB console_chamados');
    const result = await TkGestao.getByDirecionamento(direcionamento);
    
    global.emitTraffic('TkGestao', 'completed', 'Concluído - Busca por direcionamento realizada');
    global.emitLog('success', `GET /api/tk-gestao/direcionamento/${direcionamento} - ${result.count} gestões encontradas`);
    global.emitJson(result);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkGestao', 'error', 'Erro ao buscar por direcionamento');
    global.emitLog('error', `GET /api/tk-gestao/direcionamento/:direcionamento - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// GET /api/tk-gestao/stats/count - Contar gestões
router.get('/stats/count', async (req, res) => {
  try {
    global.emitTraffic('TkGestao', 'received', 'Entrada recebida - GET /api/tk-gestao/stats/count');
    global.emitLog('info', 'GET /api/tk-gestao/stats/count - Contando gestões');
    
    const result = await TkGestao.count();
    
    global.emitTraffic('TkGestao', 'processing', 'Transmitindo para DB console_chamados');
    global.emitJson(result);
    
    global.emitTraffic('TkGestao', 'completed', 'Concluído - Contagem realizada');
    global.emitLog('success', `GET /api/tk-gestao/stats/count - ${result.count} gestões total`);
    
    res.json(result);
  } catch (error) {
    global.emitTraffic('TkGestao', 'error', 'Erro ao contar gestões');
    global.emitLog('error', `GET /api/tk-gestao/stats/count - Erro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

module.exports = router;

// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const { getDatabase } = require('../config/database');

class TkGestao {
  constructor() {
    this.collectionName = 'tk_gestão';
    this.dbName = process.env.CONSOLE_CHAMADOS_DB || 'console_chamados';
  }

  // Obter coleção do banco console_chamados
  getCollection() {
    const { MongoClient } = require('mongodb');
    const MONGODB_URI = 'mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@velohubcentral.od7vwts.mongodb.net/?retryWrites=true&w=majority&appName=VelohubCentral';
    
    // Conectar ao banco específico console_chamados
    const client = new MongoClient(MONGODB_URI);
    const db = client.db(this.dbName);
    return db.collection(this.collectionName);
  }

  // Listar todos os gestões
  async getAll() {
    try {
      const collection = this.getCollection();
      const gestoes = await collection.find({}).sort({ _data_hora: -1 }).toArray();
      
      return {
        success: true,
        data: gestoes,
        count: gestoes.length
      };
    } catch (error) {
      console.error('Erro ao listar tk_gestão:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Obter gestão por ID
  async getById(id) {
    try {
      const collection = this.getCollection();
      const { ObjectId } = require('mongodb');
      const gestao = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!gestao) {
        return {
          success: false,
          error: 'Gestão não encontrada'
        };
      }

      return {
        success: true,
        data: gestao
      };
    } catch (error) {
      console.error('Erro ao obter tk_gestão:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Buscar por gênero
  async getByGenero(genero) {
    try {
      const collection = this.getCollection();
      const gestoes = await collection.find({ _genero: genero }).sort({ _data_hora: -1 }).toArray();
      
      return {
        success: true,
        data: gestoes,
        count: gestoes.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_gestão por gênero:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Buscar por tipo
  async getByTipo(tipo) {
    try {
      const collection = this.getCollection();
      const gestoes = await collection.find({ _tipo: tipo }).sort({ _data_hora: -1 }).toArray();
      
      return {
        success: true,
        data: gestoes,
        count: gestoes.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_gestão por tipo:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Buscar por direcionamento
  async getByDirecionamento(direcionamento) {
    try {
      const collection = this.getCollection();
      const gestoes = await collection.find({ _direcionamento: direcionamento }).sort({ _data_hora: -1 }).toArray();
      
      return {
        success: true,
        data: gestoes,
        count: gestoes.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_gestão por direcionamento:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Contar gestões
  async count() {
    try {
      const collection = this.getCollection();
      const count = await collection.countDocuments();
      
      return {
        success: true,
        count
      };
    } catch (error) {
      console.error('Erro ao contar tk_gestão:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }
}

module.exports = new TkGestao();

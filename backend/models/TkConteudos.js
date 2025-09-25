// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const { getDatabase } = require('../config/database');

class TkConteudos {
  constructor() {
    this.collectionName = 'tk_conteudos';
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

  // Listar todos os conteúdos
  async getAll() {
    try {
      const collection = this.getCollection();
      const conteudos = await collection.find({}).sort({ _data_hora: -1 }).toArray();
      
      return {
        success: true,
        data: conteudos,
        count: conteudos.length
      };
    } catch (error) {
      console.error('Erro ao listar tk_conteudos:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Obter conteúdo por ID
  async getById(id) {
    try {
      const collection = this.getCollection();
      const { ObjectId } = require('mongodb');
      const conteudo = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!conteudo) {
        return {
          success: false,
          error: 'Conteúdo não encontrado'
        };
      }

      return {
        success: true,
        data: conteudo
      };
    } catch (error) {
      console.error('Erro ao obter tk_conteudos:', error);
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
      const conteudos = await collection.find({ _direcionamento: direcionamento }).sort({ _data_hora: -1 }).toArray();
      
      return {
        success: true,
        data: conteudos,
        count: conteudos.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_conteudos por direcionamento:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Contar conteúdos
  async count() {
    try {
      const collection = this.getCollection();
      const count = await collection.countDocuments();
      
      return {
        success: true,
        count
      };
    } catch (error) {
      console.error('Erro ao contar tk_conteudos:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }
}

module.exports = new TkConteudos();

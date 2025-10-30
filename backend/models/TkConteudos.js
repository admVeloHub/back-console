// VERSION: v1.2.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team
const { getDatabase } = require('../config/database');

class TkConteudos {
  constructor() {
    this.collectionName = 'tk_conteudos';
    this.dbName = process.env.CONSOLE_CHAMADOS_DB || 'console_chamados';
  }

  // Obter coleção do banco console_chamados
  async getCollection() {
    const { MongoClient } = require('mongodb');
    const MONGODB_URI = 'mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@velohubcentral.od7vwts.mongodb.net/?retryWrites=true&w=majority&appName=VelohubCentral';
    
    // Conectar ao banco específico console_chamados
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(this.dbName);
    return db.collection(this.collectionName);
  }

  // Listar todos os conteúdos
  async getAll() {
    try {
      const collection = await this.getCollection();
      const conteudos = await collection.find({}).sort({ createdAt: -1 }).toArray();
      
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
      const collection = await this.getCollection();
      const conteudo = await collection.findOne({ _id: id });
      
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
      const collection = await this.getCollection();
      const conteudos = await collection.find({ _direcionamento: direcionamento }).sort({ createdAt: -1 }).toArray();
      
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
      const collection = await this.getCollection();
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

  // Gerar próximo ID personalizado TKC-XXXXXX
  async getNextId() {
    try {
      const collection = await this.getCollection();
      
      // Buscar último documento ordenado por _id DESC
      const lastDoc = await collection.findOne({}, { sort: { _id: -1 } });
      
      if (!lastDoc) {
        // Se collection vazia, iniciar com TKC-000001
        return 'TKC-000001';
      }
      
      // Extrair número do último _id (ex: TKC-000123 → 123)
      const lastId = lastDoc._id;
      const match = lastId.match(/TKC-(\d+)/);
      
      if (!match) {
        throw new Error('Formato de ID inválido encontrado');
      }
      
      const lastNumber = parseInt(match[1], 10);
      const nextNumber = lastNumber + 1;
      
      // Formatar com padding de 6 dígitos
      return `TKC-${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Erro ao gerar próximo ID TKC:', error);
      throw new Error('Erro ao gerar ID do ticket');
    }
  }

  // Criar novo conteúdo
  async create(conteudoData) {
    try {
      const collection = await this.getCollection();
      
      // Gerar ID personalizado
      const newId = await this.getNextId();
      
      // Adicionar metadados seguindo o schema
      const newConteudo = {
        _id: newId,
        _userEmail: conteudoData._userEmail,
        _assunto: conteudoData._assunto,
        _genero: conteudoData._genero,
        _tipo: conteudoData._tipo,
        _corpo: conteudoData._corpo, // Array de mensagens
        _obs: conteudoData._obs || '', // Opcional
        _statusHub: conteudoData._statusHub,
        _statusConsole: conteudoData._statusConsole,
        _lastUpdatedBy: conteudoData._lastUpdatedBy || 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await collection.insertOne(newConteudo);
      
      return {
        success: true,
        data: newConteudo,
        message: 'Conteúdo criado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao criar tk_conteudos:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Atualizar conteúdo
  async update(id, updateData) {
    try {
      const collection = await this.getCollection();
      
      // Verificar se ticket existe
      const existingTicket = await collection.findOne({ _id: id });
      if (!existingTicket) {
        return {
          success: false,
          error: 'Conteúdo não encontrado'
        };
      }
      
      // Preparar dados de atualização
      const updatePayload = {
        ...updateData,
        updatedAt: new Date()
      };
      
      // Se _corpo foi enviado, adicionar ao array existente
      if (updateData._corpo && Array.isArray(updateData._corpo)) {
        updatePayload._corpo = [...existingTicket._corpo, ...updateData._corpo];
      }
      
      const result = await collection.updateOne(
        { _id: id },
        { $set: updatePayload }
      );
      
      if (result.matchedCount === 0) {
        return {
          success: false,
          error: 'Conteúdo não encontrado'
        };
      }
      
      // Buscar conteúdo atualizado
      const updatedConteudo = await collection.findOne({ _id: id });
      
      return {
        success: true,
        data: updatedConteudo,
        message: 'Conteúdo atualizado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao atualizar tk_conteudos:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Buscar por email do usuário
  async getByUserEmail(userEmail) {
    try {
      const collection = await this.getCollection();
      const conteudos = await collection.find({ _userEmail: userEmail }).sort({ createdAt: -1 }).toArray();
      
      return {
        success: true,
        data: conteudos,
        count: conteudos.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_conteudos por email:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Buscar por assunto
  async getByAssunto(assunto) {
    try {
      const collection = await this.getCollection();
      const conteudos = await collection.find({ _assunto: { $regex: assunto, $options: 'i' } }).sort({ createdAt: -1 }).toArray();
      
      return {
        success: true,
        data: conteudos,
        count: conteudos.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_conteudos por assunto:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Buscar por gênero
  async getByGenero(genero) {
    try {
      const collection = await this.getCollection();
      const conteudos = await collection.find({ _genero: genero }).sort({ createdAt: -1 }).toArray();
      
      return {
        success: true,
        data: conteudos,
        count: conteudos.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_conteudos por gênero:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }

  // Buscar por tipo
  async getByTipo(tipo) {
    try {
      const collection = await this.getCollection();
      const conteudos = await collection.find({ _tipo: tipo }).sort({ createdAt: -1 }).toArray();
      
      return {
        success: true,
        data: conteudos,
        count: conteudos.length
      };
    } catch (error) {
      console.error('Erro ao buscar tk_conteudos por tipo:', error);
      return {
        success: false,
        error: 'Erro interno do servidor'
      };
    }
  }
}

module.exports = new TkConteudos();

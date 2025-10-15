// VERSION: v1.5.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const mongoose = require('mongoose');

// Configurar conexão específica para o database console_config
const CONFIG_DB_NAME = process.env.CONSOLE_CONFIG_DB || 'console_config';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@velohubcentral.od7vwts.mongodb.net/?retryWrites=true&w=majority&appName=VelohubCentral';

// Criar conexão específica para o database de configuração
const configConnection = mongoose.createConnection(MONGODB_URI, {
  dbName: CONFIG_DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  _userMail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  _userId: {
    type: String,
    required: true,
    unique: true
  },
  _userRole: {
    type: String,
    required: true,
    default: 'viewer'
  },
  _userClearance: {
    type: {
      artigos: { type: Boolean, default: false },
      velonews: { type: Boolean, default: false },
      botPerguntas: { type: Boolean, default: false },
      botAnalises: { type: Boolean, default: false },
      chamadosInternos: { type: Boolean, default: false },
      igp: { type: Boolean, default: false },
      qualidade: { type: Boolean, default: false },
      capacity: { type: Boolean, default: false },
      config: { type: Boolean, default: false },
      servicos: { type: Boolean, default: false }
    },
    required: true,
    default: {
      artigos: false,
      velonews: false,
      botPerguntas: false,
      botAnalises: false,
      chamadosInternos: false,
      igp: false,
      qualidade: false,
      capacity: false,
      config: false,
      servicos: false
    }
  },
  _userTickets: {
    type: {
      artigos: { type: Boolean, default: false },
      processos: { type: Boolean, default: false },
      roteiros: { type: Boolean, default: false },
      treinamentos: { type: Boolean, default: false },
      funcionalidades: { type: Boolean, default: false },
      recursos: { type: Boolean, default: false },
      gestao: { type: Boolean, default: false },
      rhFin: { type: Boolean, default: false },
      facilities: { type: Boolean, default: false }
    },
    required: true,
    default: {
      artigos: false,
      processos: false,
      roteiros: false,
      treinamentos: false,
      funcionalidades: false,
      recursos: false,
      gestao: false,
      rhFin: false,
      facilities: false
    }
  },
  _funcoesAdministrativas: {
    type: {
      avaliador: { type: Boolean, default: false }
    },
    required: false,
    default: {
      avaliador: false
    }
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Índices para otimização
userSchema.index({ _userMail: 1 });
userSchema.index({ _userId: 1 });
userSchema.index({ _userRole: 1 });

module.exports = configConnection.model('Users', userSchema, 'users');

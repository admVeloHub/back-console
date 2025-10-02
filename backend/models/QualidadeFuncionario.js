const mongoose = require('mongoose');

// Configurar conexão específica para console_analises
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@velohubcentral.od7vwts.mongodb.net/?retryWrites=true&w=majority&appName=VelohubCentral';
const ANALISES_DB_NAME = process.env.CONSOLE_ANALISES_DB || 'console_analises';

// Criar conexão específica para análises
const analisesConnection = mongoose.createConnection(MONGODB_URI, {
  dbName: ANALISES_DB_NAME
});

// Schema para acessos dos funcionários
const acessoSchema = new mongoose.Schema({
  sistema: {
    type: String,
    required: true
  },
  perfil: {
    type: String,
    required: true
  },
  observacoes: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema principal para qualidade_funcionarios
const qualidadeFuncionarioSchema = new mongoose.Schema({
  colaboradorNome: {
    type: String,
    required: true,
    trim: true
  },
  dataAniversario: {
    type: Date,
    default: null
  },
  empresa: {
    type: String,
    required: true,
    trim: true
  },
  dataContratado: {
    type: Date,
    required: true
  },
  telefone: {
    type: String,
    default: '',
    trim: true
  },
  atuacao: {
    type: String,
    default: '',
    trim: true
  },
  escala: {
    type: String,
    default: '',
    trim: true
  },
  acessos: [acessoSchema],
  desligado: {
    type: Boolean,
    default: false
  },
  dataDesligamento: {
    type: Date,
    default: null
  },
  afastado: {
    type: Boolean,
    default: false
  },
  dataAfastamento: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para atualizar updatedAt antes de salvar
qualidadeFuncionarioSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware para atualizar updatedAt antes de atualizar
qualidadeFuncionarioSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Índices para otimização de consultas
qualidadeFuncionarioSchema.index({ colaboradorNome: 1 });
qualidadeFuncionarioSchema.index({ empresa: 1 });
qualidadeFuncionarioSchema.index({ desligado: 1, afastado: 1 });
qualidadeFuncionarioSchema.index({ createdAt: -1 });

module.exports = analisesConnection.model('QualidadeFuncionario', qualidadeFuncionarioSchema, 'qualidade_funcionarios');

// VERSION: v1.1.0 | DATE: 2024-12-19 | AUTHOR: Lucas Gravina - VeloHub Development Team

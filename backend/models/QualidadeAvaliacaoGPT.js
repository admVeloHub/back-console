const mongoose = require('mongoose');

// Configurar conexão específica para console_analises
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@velohubcentral.od7vwts.mongodb.net/?retryWrites=true&w=majority&appName=VelohubCentral';
const ANALISES_DB_NAME = process.env.CONSOLE_ANALISES_DB || 'console_analises';

// Criar conexão específica para análises
const analisesConnection = mongoose.createConnection(MONGODB_URI, {
  dbName: ANALISES_DB_NAME
});

// Schema para critérios GPT
const criteriosGPTSchema = new mongoose.Schema({
  saudacaoAdequada: {
    type: Boolean,
    default: false
  },
  escutaAtiva: {
    type: Boolean,
    default: false
  },
  resolucaoQuestao: {
    type: Boolean,
    default: false
  },
  empatiaCordialidade: {
    type: Boolean,
    default: false
  },
  direcionouPesquisa: {
    type: Boolean,
    default: false
  },
  procedimentoIncorreto: {
    type: Boolean,
    default: false
  },
  encerramentoBrusco: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Schema principal para qualidade_avaliacoes_gpt
const qualidadeAvaliacaoGPTSchema = new mongoose.Schema({
  avaliacaoId: {
    type: String,
    required: true,
    trim: true
  },
  analiseGPT: {
    type: String,
    required: true,
    trim: true
  },
  pontuacaoGPT: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  criteriosGPT: {
    type: criteriosGPTSchema,
    required: true
  },
  confianca: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  palavrasCriticas: [{
    type: String,
    trim: true
  }],
  calculoDetalhado: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para otimização de consultas
qualidadeAvaliacaoGPTSchema.index({ avaliacaoId: 1 });
qualidadeAvaliacaoGPTSchema.index({ pontuacaoGPT: 1 });
qualidadeAvaliacaoGPTSchema.index({ confianca: 1 });
qualidadeAvaliacaoGPTSchema.index({ createdAt: -1 });

module.exports = analisesConnection.model('QualidadeAvaliacaoGPT', qualidadeAvaliacaoGPTSchema, 'qualidade_avaliacoes_gpt');

// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: Lucas Gravina - VeloHub Development Team

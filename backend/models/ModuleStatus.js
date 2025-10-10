// VERSION: v2.2.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
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

const moduleStatusSchema = new mongoose.Schema({
  _trabalhador: {
    type: String,
    required: true,
    default: 'on',
    enum: ['on', 'off', 'revisao']
  },
  _pessoal: {
    type: String,
    required: true,
    default: 'on',
    enum: ['on', 'off', 'revisao']
  },
  _antecipacao: {
    type: String,
    required: true,
    default: 'on',
    enum: ['on', 'off', 'revisao']
  },
  _pgtoAntecip: {
    type: String,
    required: true,
    default: 'on',
    enum: ['on', 'off', 'revisao']
  },
  _irpf: {
    type: String,
    required: true,
    default: 'on',
    enum: ['on', 'off', 'revisao']
  },
  _seguro: {
    type: String,
    required: true,
    default: 'on',
    enum: ['on', 'off', 'revisao']
  }
}, {
  timestamps: true,
  collection: 'module_status'
});

// Índices para otimização
moduleStatusSchema.index({ _trabalhador: 1 });
moduleStatusSchema.index({ _pessoal: 1 });
moduleStatusSchema.index({ _antecipacao: 1 });
moduleStatusSchema.index({ _pgtoAntecip: 1 });
moduleStatusSchema.index({ _irpf: 1 });
moduleStatusSchema.index({ _seguro: 1 });
moduleStatusSchema.index({ updatedAt: -1 });

module.exports = configConnection.model('ModuleStatus', moduleStatusSchema, 'module_status');

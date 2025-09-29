// VERSION: v1.1.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
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
  moduleKey: {
    type: String,
    required: true,
    unique: true,
    enum: ['credito-trabalhador', 'credito-pessoal', 'antecipacao', 'pagamento-antecipado', 'modulo-irpf']
  },
  status: {
    type: String,
    required: true,
    enum: ['on', 'off', 'revisao']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'module_status'
});

// Índices para otimização
moduleStatusSchema.index({ moduleKey: 1 });
moduleStatusSchema.index({ status: 1 });
moduleStatusSchema.index({ updatedAt: -1 });

module.exports = configConnection.model('ModuleStatus', moduleStatusSchema, 'module_status');

// VERSION: v2.3.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
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

// Schema para status dos módulos (documento com _id: "status")
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

// Schema para perguntas frequentes do bot (documento com _id: "faq")
const faqSchema = new mongoose.Schema({
  dados: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length <= 10; // Máximo 10 perguntas
      },
      message: 'Máximo de 10 perguntas permitidas'
    }
  },
  totalPerguntas: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'module_status'
});

// Índices para otimização do schema de status
moduleStatusSchema.index({ _trabalhador: 1 });
moduleStatusSchema.index({ _pessoal: 1 });
moduleStatusSchema.index({ _antecipacao: 1 });
moduleStatusSchema.index({ _pgtoAntecip: 1 });
moduleStatusSchema.index({ _irpf: 1 });
moduleStatusSchema.index({ _seguro: 1 });
moduleStatusSchema.index({ updatedAt: -1 });

// Índices para otimização do schema FAQ
faqSchema.index({ totalPerguntas: 1 });
faqSchema.index({ updatedAt: -1 });

// Criar modelos
const ModuleStatus = configConnection.model('ModuleStatus', moduleStatusSchema, 'module_status');
const FAQ = configConnection.model('FAQ', faqSchema, 'module_status');

// Exportar ambos os modelos
module.exports = {
  ModuleStatus,
  FAQ
};

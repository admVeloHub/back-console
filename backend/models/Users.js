// VERSION: v1.1.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const mongoose = require('mongoose');

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
      chamadosInternos: { type: Boolean, default: false },
      igp: { type: Boolean, default: false },
      qualidade: { type: Boolean, default: false },
      capacity: { type: Boolean, default: false },
      config: { type: Boolean, default: false }
    },
    required: true,
    default: {
      artigos: false,
      velonews: false,
      botPerguntas: false,
      chamadosInternos: false,
      igp: false,
      qualidade: false,
      capacity: false,
      config: false
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
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Índices para otimização
userSchema.index({ _userMail: 1 });
userSchema.index({ _userId: 1 });
userSchema.index({ _userRole: 1 });

module.exports = mongoose.model('Users', userSchema, 'users');

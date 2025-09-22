// VERSION: v3.1.3 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const { MongoClient } = require('mongodb');

// Configuração do MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<lucasgravina>:<db_password>@velohubcentral.od7vwts.mongodb.net/?retryWrites=true&w=majority&appName=VelohubCentral';
const DB_NAME = process.env.DB_NAME || 'console-conteudo-velohub';

let client;
let db;

// Conectar ao MongoDB
const connectToDatabase = async () => {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      console.log('✅ Conectado ao MongoDB');
    }
    
    if (!db) {
      db = client.db(DB_NAME);
    }
    
    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};

// Obter instância do banco
const getDatabase = () => {
  if (!db) {
    throw new Error('Database não conectado. Chame connectToDatabase() primeiro.');
  }
  return db;
};

// Fechar conexão
const closeDatabase = async () => {
  if (client) {
    await client.close();
    console.log('🔌 Conexão com MongoDB fechada');
  }
};

// Health check do banco
const checkDatabaseHealth = async () => {
  try {
    const database = getDatabase();
    await database.admin().ping();
    return { status: 'healthy', message: 'MongoDB conectado' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

module.exports = {
  connectToDatabase,
  getDatabase,
  closeDatabase,
  checkDatabaseHealth
};

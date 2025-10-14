// VERSION: v4.0.3 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { connectToDatabase, checkDatabaseHealth } = require('./config/database');
const { initializeCollections, getCollectionsStats } = require('./config/collections');
require('dotenv').config();

// Importar rotas
const artigosRoutes = require('./routes/artigos');
const velonewsRoutes = require('./routes/velonews');
const botPerguntasRoutes = require('./routes/botPerguntas');
const igpRoutes = require('./routes/igp');
const tkConteudosRoutes = require('./routes/tkConteudos');
const tkGestaoRoutes = require('./routes/tkGestao');
const userPingRoutes = require('./routes/userPing');
const usersRoutes = require('./routes/users');
const moduleStatusRoutes = require('./routes/moduleStatus');
const faqBotRoutes = require('./routes/faqBot');
const qualidadeRoutes = require('./routes/qualidade');
const botAnalisesRoutes = require('./routes/botAnalises');

// Importar middleware
const { checkMonitoringFunctions } = require('./middleware/monitoring');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas as origens para Vercel
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false // Desabilitar credentials para Vercel
  },
  transports: ['polling'], // Usar apenas polling no Vercel
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6
});
const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'", "https://fonts.googleapis.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "ws:", "wss:", "https:", "*"]
    }
  }
}));
app.use(cors({
  origin: "*", // Permitir todas as origens para Vercel
  credentials: false, // Desabilitar credentials para Vercel
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000 // máximo 1000 requests por IP
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (página de monitoramento)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Middleware de monitoramento
app.use(checkMonitoringFunctions);

// Rotas da API
app.use('/api/artigos', artigosRoutes);
app.use('/api/velonews', velonewsRoutes);
app.use('/api/bot-perguntas', botPerguntasRoutes);
app.use('/api/igp', igpRoutes);
app.use('/api/tk-conteudos', tkConteudosRoutes);
app.use('/api/tk-gestao', tkGestaoRoutes);
app.use('/api/user-ping', userPingRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/module-status', moduleStatusRoutes);
app.use('/api/faq-bot', faqBotRoutes);
app.use('/api/qualidade', qualidadeRoutes);
app.use('/api/bot-analises', botAnalisesRoutes);

// Rota de health check
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const collectionsStats = await getCollectionsStats();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      collections: collectionsStats
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      error: error.message
    });
  }
});

// Rota raiz para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'Console de Conteúdo VeloHub API v4.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    monitor: '/monitor.html'
  });
});

// Rota para a página de monitoramento
app.get('/monitor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'monitor.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// WebSocket para monitoramento
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado ao Monitor Skynet');
  
  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado do Monitor Skynet');
  });
});

// Função para emitir logs para o monitor
const emitLog = (level, message) => {
  io.emit('console-log', {
    level,
    message,
    timestamp: new Date().toISOString()
  });
};

// Função para emitir tráfego da API
const emitTraffic = (origin, status, message, details = null) => {
  io.emit('api-traffic', {
    origin,
    status,
    message,
    details,
    timestamp: new Date().toISOString()
  });
};

// Função para emitir JSON atual
const emitJson = (data) => {
  io.emit('current-json', data);
};

// Função para emitir JSON Input (dados recebidos do MongoDB)
const emitJsonInput = (data) => {
  io.emit('current-json-input', data);
};

// Tornar as funções disponíveis globalmente
global.emitLog = emitLog;
global.emitTraffic = emitTraffic;
global.emitJson = emitJson;
global.emitJsonInput = emitJsonInput;

// Inicializar servidor
const startServer = async () => {
  try {
    // Conectar ao MongoDB
    await connectToDatabase();
    await initializeCollections();
    
    // Configurar Mongoose
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@velohubcentral.od7vwts.mongodb.net/?retryWrites=true&w=majority&appName=VelohubCentral';
    await mongoose.connect(MONGODB_URI, {
      dbName: 'console_conteudo'
    });
    
    console.log(`🗄️ MongoDB: Conectado`);
    console.log(`📊 Collections: Inicializadas`);
    console.log(`🔗 Mongoose: Conectado ao console_conteudo`);
    
    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Console de Conteúdo VeloHub v4.0.0`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Monitor Skynet: http://localhost:${PORT}/monitor`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

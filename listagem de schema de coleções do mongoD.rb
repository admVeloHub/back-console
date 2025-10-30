listagem de schema de coleções do mongoDB
  <!-- VERSION: v1.15.0 | DATE: 2025-01-30 | AUTHOR: VeloHub Development Team -->
  
    🗄️ Database Principal: console_conteudo
  
  //schema console_conteudo.Artigos
  {
  _id: ObjectId,
  tag: String,                    // Tag do artigo
  categoria_id: String,           // ID da categoria
  categoria_titulo: String,       // Título da categoria
  artigo_titulo: String,          // Título do artigo
  artigo_conteudo: String,        // Conteúdo do artigo (FORMATADO - ver padrões abaixo)
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
  
  //schema console_conteudo.Bot_perguntas
  {
  _id: ObjectId,
  pergunta: String,               // Pergunta do bot
  resposta: String,               // Resposta do bot (FORMATADA - ver padrões abaixo)
  palavrasChave: String,          // Palavras-chave
  sinonimos: String,              // Sinônimos
  tabulacao: String,              // Tabulação
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
  
  //schema console_conteudo.Velonews
  {
  _id: ObjectId,
  titulo: String,                 // Título da notícia
  conteudo: String,               // Conteúdo da notícia
  isCritical: Boolean,            // Se é notícia crítica
  solved: Boolean,                // Se a notícia foi resolvida (default: false)
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
      
  //schema console_conteudo.user_activity
  {
  _id: ObjectId,
  colaboradorNome: String,           // Nome do colaborador
  action: String,                    // Tipo de ação (question_asked, feedback_given, article_viewed, ai_button_used)
  details: {                         // Detalhes específicos da ação
    question: String,                // Pergunta feita (para question_asked)
    feedbackType: String,            // Tipo de feedback (positive/negative)
    messageId: String,               // ID da mensagem (para feedback)
    articleId: String,               // ID do artigo (para article_viewed)
    articleTitle: String,            // Título do artigo
    formatType: String               // Tipo de formatação (whatsapp/email)
  },
  sessionId: String,                 // ID da sessão
  source: String,                    // Fonte da ação (chatbot, ai_button, etc.)
  createdAt: Date,                   // Data de criação
  updatedAt: Date                    // Data de atualização
  }
  
  //schema console_conteudo.hub_sessions
  {
  _id: ObjectId,
  colaboradorNome: String,           // Nome do colaborador
  userEmail: String,                 // Email do usuário
  sessionId: String,                 // ID único da sessão (UUID)
  ipAddress: String,                 // IP do usuário (opcional)
  userAgent: String,                 // Navegador/dispositivo (opcional)
  isActive: Boolean,                 // Se a sessão está ativa
  loginTimestamp: Date,              // Data/hora do login
  logoutTimestamp: Date,             // Data/hora do logout (null se ativo)
  createdAt: Date,                   // Data de criação
  updatedAt: Date                    // Data de atualização
  }
  
  //schema console_conteudo.velonews_acknowledgments
  {
  _id: ObjectId,
  newsId: ObjectId,              // Referência à notícia (Velonews._id)
  colaboradorNome: String,       // Nome do colaborador que confirmou
  userEmail: String,             // Email do usuário
  acknowledgedAt: Date,          // Data/hora da confirmação
  createdAt: Date,               // Data de criação
  updatedAt: Date                // Data de atualização
  }
  
  //schema console_conteudo.bot_feedback
  {
  _id: ObjectId,
  colaboradorNome: String,           // Nome do colaborador que deu o feedback
  action: String,                    // Tipo de ação (feedback_given)
  messageId: String,                 // ID da mensagem que recebeu o feedback
  sessionId: String,                 // ID da sessão
  source: String,                    // Fonte da resposta (chatbot, ai_button, clarification, etc.)
  details: {                         // Detalhes específicos do feedback
    feedbackType: String,            // Tipo de feedback (positive/negative)
    comment: String,                 // Comentário opcional do usuário
    question: String,                // Pergunta original que gerou a resposta
    answer: String,                  // Resposta do bot que recebeu o feedback
    aiProvider: String,              // Provedor da IA (OpenAI, Gemini, null)
    responseSource: String           // Origem da resposta (bot_perguntas, ai, clarification, etc.)
  },
  createdAt: Date,                   // Data de criação
  updatedAt: Date                    // Data de atualização
  }
  

  🗄️ Database: console_chamados
  
    // schema DB console_chamados.tk_gestão
  // Tickets de gestão, RH e financeiro, facilities
  {
  _id: String,                    // ID personalizado com prefixo TKG- + numeração automática (ex: TKG-000001)
  _userEmail: String,             // Email do usuário (obtido via SSO) - MOVIDO para 2ª posição
  _genero: String,                // Gênero do ticket (Gestão, RH e Financeiro, Facilities)
  _tipo: String,                  // Tipo do ticket (solicitação, agendamento, notificação, etc.)
  _direcionamento: String,        // Direcionamento (supervisor, gestor, backoffice, RH, Financeiro, etc.)
  _corpo: [                       // Array de mensagens do ticket (ALTERADO de String para Array)
    {
      autor: String,              // "user" | "admin"
      userName: String,           // Nome obtido do SSO
      timestamp: Date,            // Data/hora da mensagem
      mensagem: String            // Conteúdo da mensagem
    }
  ],
  _atribuido: string,             // Atribuído a (opcional)
  _processo: string,              // Processo (opcional)
  _processamento: String,         // Processamento (aprovação do gestor, consulta viabilidade, processamento) - OPCIONAL
  _statusHub: String,             // Status para usuário (novo, aberto, em espera pendente, resolvido)
  _statusConsole: String,         // Status para gestor (novo, aberto, em espera, pendente, resolvido)
  _lastUpdatedBy: String,         // Quem atualizou por último (user, admin)
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
  

  // schema DB console_chamados.tk_conteudos
  // Tickets de conteúdo (artigos, processos, roteiros, treinamentos, funcionalidades, recursos)
  {
  _id: String,                    // ID personalizado com prefixo TKC- + numeração automática (ex: TKC-000001)
  _userEmail: String,             // Email do usuário (obtido via SSO) - MOVIDO para 2ª posição
  _assunto: String,                // Assunto do ticket
  _genero: String,                // Gênero do ticket (Artigo, Processo, Roteiro, Treinamento, Funcionalidade, Recurso Adicional)
  _tipo: String,                  // Tipo do ticket (assunto, produto, ambiente, tipo_recurso, etc.)
  _corpo: [                       // Array de mensagens do ticket (ALTERADO de String para Array)
    {
      autor: String,              // "user" | "admin"
      userName: String,           // Nome obtido do SSO
      timestamp: Date,            // Data/hora da mensagem
      mensagem: String            // Conteúdo da mensagem
    }
  ],
  _obs: String,                   // Observações (opcional)
  _atribuido: string,             // Atribuído a (opcional)
  _processo: string,              // Processo (opcional)
  _processamento: String,         // Processamento (aprovação do gestor, consulta viabilidade, processamento) - OPCIONAL
  _statusHub: String,             // Status para usuário (novo, aberto, em espera pendente, resolvido)
  _statusConsole: String,         // Status para gestor (novo, aberto, em espera, pendente, resolvido)
  _lastUpdatedBy: String,         // Quem atualizou por último (user, admin)
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
  
  // ===== MAPEAMENTO DE FORMULÁRIOS PARA SCHEMAS =====
  
  // FORMULÁRIOS TK_CONTEUDOS (6 Gêneros):
  // 1. Artigo: assunto → _assunto, tipo → _tipo, descrição → _corpo, ocorrência → _obs
  // 2. Processo: assunto → _assunto, tipo → _tipo, descrição → _corpo, ocorrência → _obs
  // 3. Roteiro: assunto → _assunto, tipo → _tipo, descrição → _corpo, ocorrência → _obs
  // 4. Treinamento: assunto → _assunto, tipo → _tipo, descrição → _corpo, ocorrência → _obs
  // 5. Funcionalidade: assunto → _assunto, tipo → _tipo, descrição → _corpo, ocorrência → _obs
  // 6. Recurso Adicional: assunto → _assunto, tipo → _tipo, descrição → _corpo, ocorrência → _obs
  
  // FORMULÁRIOS TK_GESTÃO (3 Gêneros):
  // 1. Gestão: tipo → _tipo, direcionado → _direcionamento, mensagem → _corpo
  // 2. RH e Financeiro: tipo → _tipo, setor → _direcionamento, mensagem → _corpo
  // 3. Facilities: tipo → _tipo, categoria → _direcionamento, mensagem → _corpo
  
  
  
  🗄️ Database: console_config
  
  // Schema Config
  {
  _id: ObjectId,
  _userMail: String,              // Email do usuário
  _userId: String,                // ID do usuário
  _userRole: String,              // Papel do usuário
  _userClearance: {               // Permissões do usuário
    artigos: Boolean,
    velonews: Boolean,
    botPerguntas: Boolean,
    botAnalises: Boolean,         // Permissão para Bot Análises
    hubAnalises: Boolean,         // Permissão para Hub Análises
    chamadosInternos: Boolean,
    igp: Boolean,
    qualidade: Boolean,
    capacity: Boolean,
    config: Boolean,
    servicos: Boolean
  },
  _userTickets: {                 // Tipos de tickets
    artigos: Boolean,
    processos: Boolean,
    roteiros: Boolean,
    treinamentos: Boolean,
    funcionalidades: Boolean,
    recursos: Boolean,
    gestao: Boolean,
    rhFin: Boolean,
    facilities: Boolean
  },
  _funcoesAdministrativas: {      // Funções administrativas
    avaliador: Boolean,           // Se é avaliador no módulo Qualidade
    auditoria: Boolean,           // Se tem permissão para auditoria
    relatoriosGestao: Boolean     // Se tem permissão para relatórios de gestão
  },
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
  
   //schema console_config.module_status
  {
  _id: "status",
  _trabalhador: String,    // Status do Crédito Trabalhador
  _pessoal: String,        // Status do Crédito Pessoal  
  _antecipacao: String,    // Status da Antecipação
  _pgtoAntecip: String,    // Status do Pagamento Antecipado
  _irpf: String,           // Status do Módulo IRPF
  _seguro: String,         // Status do Módulo Seguro
  createdAt: Date,         // Data de criação
  updatedAt: Date          // Data de atualização
  }
  
  
  //🗄️ Schema de Ping de Usuário
  // de login ou refresh
  {
  _userId: String,                // ID do usuário
  _collectionId: String,          // ID da collection
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
  
  🗄️ Database console_analises
  9. schema console_analises.qualidade_avaliacoes
{
_id: ObjectId,
colaboradorNome: String,        // Nome do colaborador
avaliador: String,              // Avaliador
mes: String,                    // Mês da avaliação
ano: Number,                    // Ano da avaliação
saudacaoAdequada: Boolean,      // Critério de avaliação
escutaAtiva: Boolean,           // Critério de avaliação
clarezaObjetividade: Boolean,   // Critério de avaliação (NOVO)
resolucaoQuestao: Boolean,      // Critério de avaliação
dominioAssunto: Boolean,        // Critério de avaliação (NOVO)
empatiaCordialidade: Boolean,   // Critério de avaliação
direcionouPesquisa: Boolean,    // Critério de avaliação
procedimentoIncorreto: Boolean, // Critério de avaliação
encerramentoBrusco: Boolean,    // Critério de avaliação
pontuacaoTotal: Number,         // Pontuação total
observacoes: String,            // Observações da avaliação
dataLigacao: Date,              // Data da ligação
createdAt: Date,                // Data de criação
updatedAt: Date,                // Data de atualização
}

  //schema console_analises.qualidade_funcionarios
  {
  _id: ObjectId,
  colaboradorNome: String,        // Nome completo (padronizado)
  dataAniversario: Date,          // Data de aniversário
  empresa: String,                // Empresa
  dataContratado: Date,           // Data de contratação
  telefone: String,               // Telefone
  atuacao: [ObjectId],            // Array de referências para qualidade_funcoes
  escala: String,                 // Escala
  acessos: [{                     // Array de acessos
    sistema: String,
    perfil: String,
    observacoes: String,
    updatedAt: Date
  }],
  desligado: Boolean,             // Se foi desligado
  dataDesligamento: Date,         // Data de desligamento
  afastado: Boolean,              // Se está afastado
  dataAfastamento: Date,          // Data de afastamento
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização
  }
  
  //schema console_analises.qualidade_avaliacoes_gpt
  {
  _id: ObjectId,
  avaliacao_id: ObjectId,         // Referência à avaliação original (padronizado)
  analiseGPT: String,             // Análise completa do GPT
  pontuacaoGPT: Number,           // Pontuação calculada pelo GPT (0-100)
  criteriosGPT: {                 // Critérios avaliados pelo GPT
    saudacaoAdequada: Boolean,
    escutaAtiva: Boolean,
    clarezaObjetividade: Boolean,  // NOVO critério
    resolucaoQuestao: Boolean,
    dominioAssunto: Boolean,       // NOVO critério
    empatiaCordialidade: Boolean,
    direcionouPesquisa: Boolean,
    procedimentoIncorreto: Boolean,
    encerramentoBrusco: Boolean
  },
  confianca: Number,              // Nível de confiança (0-100)
  palavrasCriticas: [String],     // Palavras-chave críticas mencionadas
  calculoDetalhado: [String],     // Explicação do cálculo da pontuação
  createdAt: Date,                // Data de criação
  updatedAt: Date                 // Data de atualização (padronizado)
  }
  
  //schema console_analises.qualidade_funcoes
  {
  _id: ObjectId,
  funcao: String,              // Nome da função (ex: "Atendimento", "Suporte Técnico")
  descricao: String,           // Descrição opcional da função
  createdAt: Date,             // Data de criação
  updatedAt: Date              // Data de atualização
  }
  
  //schema console_analises.faq_bot
  // 
  {
  _id: "faq",                      // ID fixo para identificação no backend
  dados: [String],                 // Array com as 10 perguntas mais feitas (apenas os textos)
  totalPerguntas: Number,          // Total de perguntas no período
  updatedAt: Date                  // Data de atualização (controle de versionamento)
  }
  
  // ========================================
  // 📋 PADRÕES DE FORMATAÇÃO DE CONTEÚDO
  // ========================================
  // VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
  
  /*
  🎯 PADRÕES DE FORMATAÇÃO PARA CONTEÚDO (Bot_perguntas.resposta e Artigos.artigo_conteudo)
  
  1. QUEBRAS DE LINHA:
     - Usar \n para quebras de linha simples
     - Usar \n\n para separação de parágrafos
     - Evitar mais de 2 \n consecutivos
  
  2. LISTAS NUMERADAS:
     - Formato: "1. Item\n2. Item\n3. Item"
     - Sempre usar números seguidos de ponto e espaço
     - Uma quebra de linha entre cada item
  
  3. LISTAS COM BULLETS:
     - Formato: "• Item\n• Item\n• Item"
     - Usar bullet Unicode (•) seguido de espaço
     - Uma quebra de linha entre cada item
  
  4. NEGRITO E ITÁLICO:
     - Negrito: **texto** (markdown)
     - Itálico: *texto* (markdown)
     - Evitar HTML tags (<b>, <i>, <strong>, <em>)
  
  5. LINKS:
     - Formato: [texto do link](URL)
     - Sempre incluir texto descritivo
     - URLs completas com http/https
  
  6. CARACTERES ESPECIAIS:
     - Usar encoding UTF-8 correto
     - Acentos: á, é, í, ó, ú, ã, õ, ç
     - Símbolos: R$, %, º, ª, etc.
  
  7. ESTRUTURA DE PARÁGRAFOS:
     - Máximo 3-4 linhas por parágrafo
     - Usar \n\n para separar seções
     - Evitar blocos de texto muito longos
  
  8. FORMATAÇÃO DE CÓDIGOS/COMANDOS:
     - Usar `código` para inline
     - Usar ```código``` para blocos
     - Especificar linguagem quando relevante
  
  9. FORMATAÇÃO DE DATAS:
     - Formato: DD/MM/AAAA
     - Horários: HH:MM (24h)
     - Evitar formatos ambíguos
  
  10. FORMATAÇÃO DE VALORES:
      - Moeda: R$ 1.234,56
      - Percentuais: 15%
      - Números grandes: 1.000.000
  
  EXEMPLOS DE FORMATAÇÃO CORRETA:
  
  ✅ BOM:
  "Para solicitar o crédito trabalhador:
  
  1. Acesse o portal VeloHub
  2. Preencha os dados pessoais
  3. Envie os documentos necessários
  
  **Importante:** O processo pode levar até 5 dias úteis.
  
  Para mais informações, consulte: [Manual do Crédito](https://manual.velohub.com)"
  
  ❌ RUIM:
  "Para solicitar o crédito trabalhador você deve acessar o portal VeloHub preencher os dados pessoais enviar os documentos necessários o processo pode levar até 5 dias úteis para mais informações consulte o manual"
  
  APLICAÇÃO:
  - Bot_perguntas.resposta: Sempre formatar seguindo estes padrões
  - Artigos.artigo_conteudo: Sempre formatar seguindo estes padrões
  - Backend: Aplicar formatação automática se conteúdo não estiver formatado
  - Frontend: Renderizar formatação markdown corretamente
  */
  npm 
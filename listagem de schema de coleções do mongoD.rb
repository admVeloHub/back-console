listagem de schema de coleções do mongoDB
  🗄️ Database Principal: console_conteudo
//schema console_conteudo.Artigos
{
_id: ObjectId,
tag: String,                    // Tag do artigo
categoria_id: String,           // ID da categoria
categoria_titulo: String,       // Título da categoria
artigo_titulo: String,          // Título do artigo
artigo_conteudo: String,        // Conteúdo do artigo
createdAt: Date,                // Data de criação
updatedAt: Date                 // Data de atualização
}

//schema console_conteudo.Bot_perguntas
{
_id: ObjectId,
Pergunta: String,               // Pergunta do bot
Resposta: String,               // Resposta do bot
"Palavras-chave": String,       // Palavras-chave
Sinonimos: String,              // Sinônimos
Tabulação: String,              // Tabulação
createdAt: Date,                // Data de criação
updatedAt: Date                 // Data de atualização
}

//schema console_conteudo.Velonews
{
_id: ObjectId,
title: String,                  // Título da notícia
content: String,                // Conteúdo da notícia
isCritical: Boolean,            // Se é notícia crítica
createdAt: Date,                // Data de criação
updatedAt: Date                 // Data de atualização
}

🗄️ Database: console_chamados

// schema DB console_chamados.tk_gestão
{
_id: ObjectId,
_genero: String,                // Gênero do ticket
_tipo: String,                  // Tipo do ticket
_direcionamento: String,        // Direcionamento
_corpo: String,                 // Corpo do ticket
_data_hora: Date                // Data e hora
}

// schema DB console_chamados.tk_conteudos
{
_id: ObjectId,
_direcionamento: String,        // Direcionamento
_descrição: String,             // Descrição
_obs: String,                   // Observações
_data_hora: Date                // Data e hora
}

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
  chamadosInternos: Boolean,
  igp: Boolean,
  qualidade: Boolean,
  capacity: Boolean,
  config: Boolean,
  servicos: Boolean
},
_userTickets: Object,           // Tipos de tickets
_funcoesAdministrativas: {      // Funções administrativas do usuário
  avaliador: Boolean            // Se é avaliador no módulo Qualidade
}
}

//schema console_config.module_status
// Schema MongoDB atualizado
{
_id: ObjectId,
_trabalhador: String,    // Status do Crédito Trabalhador
_pessoal: String,        // Status do Crédito Pessoal  
_antecipacao: String,    // Status da Antecipação
_pgtoAntecip: String,    // Status do Pagamento Antecipado
_irpf: String,           // Status do Módulo IRPF
createdAt: Date,
updatedAt: Date
}


//🗄️ Schema de Ping de Usuário
de login ou refresh
{
_userId: String,                // ID do usuário
_collectionId: String           // ID da collection
}

🗄️ Database console_analises
9. schema console_analises.qualidade_avaliacoes
{
_id: ObjectId,
colaboradorNome: String,        // Nome do colaborador
avaliador: String,              // Avaliador
mes: String,                    // Mês da avaliação
ano: Number,                    // Ano da avaliação
dataAvaliacao: Date,            // Data da avaliação
arquivoLigacao: String,         // Base64 ou URL
nomeArquivo: String,            // Nome do arquivo
saudacaoAdequada: Boolean,      // Critério de avaliação
escutaAtiva: Boolean,           // Critério de avaliação
resolucaoQuestao: Boolean,      // Critério de avaliação
empatiaCordialidade: Boolean,   // Critério de avaliação
direcionouPesquisa: Boolean,    // Critério de avaliação
procedimentoIncorreto: Boolean, // Critério de avaliação
encerramentoBrusco: Boolean,    // Critério de avaliação
moderado: Boolean,              // Se foi moderado
observacoesModeracao: String,   // Observações da moderação
pontuacaoTotal: Number,         // Pontuação total
createdAt: Date,                // Data de criação
updatedAt: Date,                // Data de atualização
}

//schema console_analises.qualidade_funcionarios
{
_id: ObjectId,
nomeCompleto: String,           // Nome completo
dataAniversario: Date,          // Data de aniversário
empresa: String,                // Empresa
dataContratado: Date,           // Data de contratação
telefone: String,               // Telefone
atuacao: String,                // Atuação
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
avaliacaoId: String,            // ID da avaliação original
analiseGPT: String,             // Análise completa do GPT
pontuacaoGPT: Number,           // Pontuação calculada pelo GPT (0-100)
criteriosGPT: {                 // Critérios avaliados pelo GPT
  saudacaoAdequada: Boolean,
  escutaAtiva: Boolean,
  resolucaoQuestao: Boolean,
  empatiaCordialidade: Boolean,
  direcionouPesquisa: Boolean,
  procedimentoIncorreto: Boolean,
  encerramentoBrusco: Boolean
},
confianca: Number,              // Nível de confiança (0-100)
palavrasCriticas: [String],     // Palavras-chave críticas mencionadas
calculoDetalhado: [String],     // Explicação do cálculo da pontuação
createdAt: Date                 // Data de criação
}


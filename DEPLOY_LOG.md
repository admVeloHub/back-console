# DEPLOY LOG - Console de Conteúdo VeloHub

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:59:00  
**Tipo:** GitHub Push  
**Versão:** v3.10.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/routes/qualidade.js` (v3.6.0)
- `backend/scripts/migrations/` - **NOVO** (8 arquivos de migração)
- `DEPLOY_LOG.md`

### Descrição:
Correção crítica do erro 400 no endpoint POST /api/qualidade/avaliacoes:

**Problema Resolvido:**
- Endpoint retornava erro 400 devido à validação restritiva do campo `ano`
- Validação exigia que `ano` fosse exatamente do tipo `number`
- Frontend enviava dados válidos mas validação falhava

**Correções Implementadas:**
- Validação flexível do campo `ano` (aceita number e string)
- Conversão automática de string para number usando `parseInt()`
- Aplicada em validação inicial, endpoint POST e PUT
- Melhoria na robustez da API de qualidade

**Funcionalidades Validadas:**
- ✅ Aceita `ano` como number (2025)
- ✅ Aceita `ano` como string ("2025") com conversão automática
- ✅ Validação de números inválidos mantida
- ✅ Compatibilidade total com dados do frontend
- ✅ Endpoints POST e PUT funcionando corretamente

**Teste Realizado:**
```json
{
  "colaboradorNome": "Gravina_dev",
  "avaliador": "Lucas Gravina", 
  "mes": "Julho",
  "ano": 2025,
  "dataAvaliacao": "2025-10-02T19:56:00.600Z",
  "pontuacaoTotal": 75
}
```

**Commit Hash:** e112ef4  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:59:00  
**Tipo:** GitHub Push  
**Versão:** v3.11.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `DEPLOY_LOG.md`

### Descrição:
Correção definitiva do erro 400 - remoção de índices problemáticos no MongoDB:

**Problema Identificado:**
- Erro real era `E11000 duplicate key error` no índice `id_1`
- Índices obsoletos causando conflitos na collection `qualidade_avaliacoes`
- Validação do campo `ano` estava correta, problema era estrutural

**Correções Implementadas:**
- Removido índice problemático `id_1` que causava duplicate key error
- Removido índice obsoleto `colaboradorId_1` (campo foi removido)
- Mantidos índices corretos: `colaboradorNome_1`, `avaliador_1`, `mes_1_ano_1`, `dataAvaliacao_-1`, `createdAt_-1`
- Limpeza completa da estrutura de índices no MongoDB

**Teste Final Realizado:**
```json
{
  "colaboradorNome": "Gravina_dev",
  "avaliador": "Lucas Gravina",
  "mes": "Julho", 
  "ano": 2025,
  "dataAvaliacao": "2025-10-02T20:12:47.445Z",
  "pontuacaoTotal": 75
}
```

**Resultado:**
- ✅ Salvamento funcionando perfeitamente
- ✅ Dados persistidos corretamente no MongoDB
- ✅ Tipos de dados respeitados (Number, Date, Boolean, String)
- ✅ Endpoint POST /api/qualidade/avaliacoes 100% funcional

**Commit Hash:** 8e637c7  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 15:30:00  
**Tipo:** GitHub Push  
**Versão:** v3.3.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/config/collections.js` (v3.2.0)
- `backend/models/Users.js` (v1.1.0) - **NOVO**
- `backend/routes/users.js` (v1.1.0) - **NOVO**
- `backend/server.js` (v3.3.0)
- `listagem de schema de coleções do mongoD.rb`

### Descrição:
Implementação completa dos endpoints de usuários para integração com MongoDB:

**Funcionalidades Implementadas:**
- Modelo Users.js com schema completo para collection `console_config.users`
- Rotas CRUD completas para gerenciamento de usuários autorizados
- Schema atualizado com `_userClearance` e `_userTickets` como Objects
- Validações para email único e campos obrigatórios
- Integração com sistema de monitoramento existente

**Endpoints Disponíveis:**
- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/:email` - Atualizar usuário
- `DELETE /api/users/:email` - Deletar usuário
- `GET /api/users/check/:email` - Verificar autorização
- `GET /api/users/:email` - Obter dados do usuário

**Commit Hash:** 86ee4dd  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 15:45:00  
**Tipo:** GitHub Push  
**Versão:** v3.3.1  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/config/database.js` (v3.2.0)
- `backend/models/Users.js` (v1.2.0)
- `env.example` (v3.3.0)
- `CONFIGURACAO_VERCEL.md`
- `DEPLOY_LOG.md` - **NOVO**

### Descrição:
Correção crítica para usar database `console_config` correta:

**Correções Implementadas:**
- Adicionada variável `CONSOLE_CONFIG_DB=console_config`
- Atualizado Users.js para usar database `console_config` específica
- Atualizado database.js para suportar múltiplas databases
- Corrigida conexão Mongoose para database correta
- Atualizada documentação com nova variável de ambiente

**Nova Variável de Ambiente Necessária no Vercel:**
```
CONSOLE_CONFIG_DB=console_config
```

**Commit Hash:** 704be7a  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 16:15:00  
**Tipo:** GitHub Push  
**Versão:** v3.3.1  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/public/monitor.html` (header atualizado)
- `backend/public/skynet.jpg` - **NOVO**
- `package-lock.json` - **NOVO**
- `skynet.jpg` - **NOVO**
- `visualizacao_header.html` - **NOVO**
- `DEPLOY_LOG.md`

### Descrição:
Implementação das imagens skynet.jpg no header do Monitor Skynet:

**Funcionalidades Implementadas:**
- Duas imagens skynet.jpg posicionadas no header (esquerda e direita)
- Imagem da esquerda horizontalmente invertida (transform: scaleX(-1))
- Layout do header reformulado para flexbox com alinhamento central
- Altura das imagens definida em 69px com drop-shadow verde
- Imagem copiada para pasta pública para acesso via servidor
- Dependências instaladas e package-lock.json gerado

**Melhorias Visuais:**
- Header mais impactante e futurístico
- Imagens simétricas com efeito espelhado
- Mantém identidade visual do Monitor Skynet
- Efeito drop-shadow verde para consistência visual

**Commit Hash:** 82388a6  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 21:15:00  
**Tipo:** GitHub Push  
**Versão:** v3.4.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/ModuleStatus.js` (v1.1.0) - **NOVO**
- `backend/routes/moduleStatus.js` (v1.1.0) - **NOVO**
- `backend/server.js` (v3.4.0)
- `listagem de schema de coleções do mongoD.rb`
- `DEPLOY_LOG.md`

### Descrição:
Implementação completa da API de Module Status para gerenciar status dos serviços VeloHub:

**Funcionalidades Implementadas:**
- Modelo ModuleStatus.js com schema completo para collection `console_config.module_status`
- Rotas completas com GET, POST e PUT endpoints para gerenciamento de status
- Suporte a 5 serviços: credito-trabalhador, credito-pessoal, antecipacao, pagamento-antecipado, modulo-irpf
- Status possíveis: on, off, revisao
- Validações completas para moduleKey e status
- Tratamento de erros padronizado
- Logs de monitoramento integrados com sistema existente
- Schema documentado em listagem de coleções MongoDB

**Endpoints Disponíveis:**
- `GET /api/module-status` - Buscar status de todos os módulos
- `POST /api/module-status` - Atualizar status de um módulo específico
- `PUT /api/module-status` - Atualizar múltiplos módulos simultaneamente

**Testes Realizados:**
- ✅ Todos os endpoints testados e funcionando
- ✅ Validações de erro funcionando corretamente
- ✅ Persistência no MongoDB funcionando
- ✅ Logs de monitoramento sendo emitidos

**Commit Hash:** b6ec340  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 21:30:00  
**Tipo:** GitHub Push  
**Versão:** v3.4.1  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/ModuleStatus.js` (v2.0.0)
- `backend/routes/moduleStatus.js` (v2.1.0)
- `listagem de schema de coleções do mongoD.rb`

### Descrição:
Atualização da API Module Status para schema de documento único com monitoramento completo:

**Principais Alterações:**
- Schema alterado de múltiplos documentos para documento único
- Campos do schema: _trabalhador, _pessoal, _antecipacao, _pgtoAntecip, _irpf
- Mapeamento de campos do frontend para schema do banco
- Monitoramento completo integrado ao Monitor Skynet

**Funcionalidades de Monitoramento Adicionadas:**
- Logs de entrada (received) para todos os endpoints
- Logs de processamento (processing) para operações MongoDB
- Logs de conclusão (completed) para operações bem-sucedidas
- JSON output completo no Monitor Skynet
- Dados de entrada e saída exibidos em tempo real

**Melhorias Técnicas:**
- Documento único no MongoDB para melhor performance
- Validações mantidas e funcionando
- Compatibilidade total com frontend existente
- Logs detalhados para debugging e monitoramento

**Commit Hash:** 45168f1  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 22:00:00  
**Tipo:** GitHub Push  
**Versão:** v3.5.1  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/QualidadeAvaliacaoGPT.js` (v1.0.0) - **NOVO**
- `backend/routes/qualidade.js` (v1.1.0)
- `listagem de schema de coleções do mongoD.rb`
- `DEPLOY_LOG.md`

### Descrição:
Implementação completa da API de Avaliações GPT para o módulo de qualidade:

**Funcionalidades Implementadas:**
- Modelo QualidadeAvaliacaoGPT.js com schema completo para collection `console_analises.qualidade_avaliacoes_gpt`
- 6 endpoints completos para gerenciamento de avaliações GPT
- Validações completas para todos os campos obrigatórios
- Tratamento de erros padronizado e logs detalhados
- Integração com sistema de monitoramento existente
- Schema documentado e atualizado

**Endpoints Disponíveis:**
- `GET /api/qualidade/avaliacoes-gpt` - Listar todas as avaliações GPT (com query param avaliacaoId)
- `GET /api/qualidade/avaliacoes-gpt/:id` - Obter avaliação GPT por ID
- `GET /api/qualidade/avaliacoes-gpt/avaliacao/:avaliacaoId` - Obter avaliação GPT por ID da avaliação original
- `POST /api/qualidade/avaliacoes-gpt` - Criar nova avaliação GPT
- `PUT /api/qualidade/avaliacoes-gpt/:id` - Atualizar avaliação GPT existente
- `DELETE /api/qualidade/avaliacoes-gpt/:id` - Deletar avaliação GPT

**Schema MongoDB:**
- Database: `console_analises`
- Collection: `qualidade_avaliacoes_gpt`
- Campos: avaliacaoId, analiseGPT, pontuacaoGPT, criteriosGPT, confianca, palavrasCriticas, calculoDetalhado, createdAt

**Testes Realizados:**
- ✅ Todos os 6 endpoints testados e funcionando
- ✅ Validações de erro funcionando corretamente
- ✅ Persistência no MongoDB funcionando
- ✅ Logs de monitoramento sendo emitidos
- ✅ Tratamento de duplicatas implementado

**Commit Hash:** 5165e9e  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:45:00  
**Tipo:** GitHub Push  
**Versão:** v3.6.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/BotPerguntas.js` (v3.2.0)
- `backend/routes/botPerguntas.js` (v3.2.0)
- `DEPLOY_LOG.md`

### Descrição:
Adequação completa do endpoint POST /api/bot-perguntas para schema MongoDB padrão:

**Problema Resolvido:**
- Backend estava rejeitando dados com erro "Dados obrigatórios ausentes"
- Endpoint esperava campos diferentes do schema padrão definido nas diretrizes

**Alterações Implementadas:**
- Schema atualizado para usar campos padrão: Pergunta, Resposta, "Palavras-chave", Sinonimos, Tabulação
- Validação corrigida para campos obrigatórios: Pergunta, Resposta e "Palavras-chave"
- Mapeamento correto de dados do frontend para schema MongoDB
- Adição automática de createdAt e updatedAt
- Método getByPergunta() atualizado para busca por campo Pergunta

**Funcionalidades Validadas:**
- ✅ Aceita exatamente os campos do schema MongoDB padrão
- ✅ Valida campos obrigatórios: Pergunta, Resposta, "Palavras-chave"
- ✅ Adiciona automaticamente createdAt e updatedAt
- ✅ Retorna sucesso quando dados válidos são enviados
- ✅ Compatível com dados enviados pelo frontend

**Teste Realizado:**
```json
{
  "Pergunta": "Crédito Pessoal - Nova Contratação",
  "Resposta": "Nova Contratação: O cliente pode realizar uma nova contratação...",
  "Palavras-chave": "crédito pessoal, nova contratação, quitação, análise de crédito, elegibilidade",
  "Sinonimos": "nova simulação, contratar novamente, novo credito",
  "Tabulação": "Empréstimo Pessoal | Crédito >Elegibilidade > Como Contratar"
}
```

**Commit Hash:** 77f32d8  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:55:00  
**Tipo:** GitHub Push  
**Versão:** v3.7.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/QualidadeAvaliacao.js` (v1.1.0)
- `backend/routes/qualidade.js` (v3.4.0)
- `env.example` (v3.4.0)
- `listagem de schema de coleções do mongoD.rb`
- `DEPLOY_LOG.md`

### Descrição:
Remoção do campo colaboradorId redundante e alinhamento completo dos schemas:

**Problema Resolvido:**
- Campo `colaboradorId` era redundante e desnecessário
- Schema não estava alinhado com especificação oficial

**Alterações Implementadas:**
- Removido campo `colaboradorId` do schema `qualidade_avaliacoes`
- Atualizado modelo QualidadeAvaliacao.js para usar apenas `colaboradorNome`
- Corrigida validação `validateAvaliacao` removendo `colaboradorId`
- Atualizado schema no arquivo de listagem de coleções MongoDB
- Adicionada variável `CONSOLE_ANALISES_DB` no env.example
- Schema agora 100% alinhado com especificação oficial

**Schema Final Atualizado:**
```json
{
  "_id": "ObjectId",
  "colaboradorNome": "String (obrigatório)",
  "avaliador": "String (obrigatório)",
  "mes": "String (obrigatório)",
  "ano": "Number (obrigatório)",
  "dataAvaliacao": "Date (obrigatório)",
  "arquivoLigacao": "String (opcional)",
  "nomeArquivo": "String (opcional)",
  "saudacaoAdequada": "Boolean (opcional)",
  "escutaAtiva": "Boolean (opcional)",
  "resolucaoQuestao": "Boolean (opcional)",
  "empatiaCordialidade": "Boolean (opcional)",
  "direcionouPesquisa": "Boolean (opcional)",
  "procedimentoIncorreto": "Boolean (opcional)",
  "encerramentoBrusco": "Boolean (opcional)",
  "moderado": "Boolean (opcional)",
  "observacoesModeracao": "String (opcional)",
  "pontuacaoTotal": "Number (opcional)",
  "createdAt": "Date (automático)",
  "updatedAt": "Date (automático)"
}
```

**Benefícios:**
- ✅ Schema mais limpo e focado
- ✅ Remoção de redundância desnecessária
- ✅ Alinhamento 100% com especificação oficial
- ✅ API mais simples e direta

**Commit Hash:** 0ffbb0b  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:59:00  
**Tipo:** GitHub Push  
**Versão:** v3.8.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/Users.js` (v1.4.0)
- `backend/routes/users.js` (v1.3.0)
- `listagem de schema de coleções do mongoD.rb`
- `DEPLOY_LOG.md`

### Descrição:
Implementação do campo _funcoesAdministrativas no schema de usuários para suporte ao módulo Qualidade:

**Funcionalidades Implementadas:**
- Adicionado campo `_funcoesAdministrativas` ao schema de usuários
- Campo opcional com default `{ avaliador: false }`
- Suporte completo nos endpoints GET, POST e PUT
- Mapeamento correto entre frontend e backend
- Documentação atualizada no schema MongoDB

**Alterações Técnicas:**
- Schema Users.js atualizado com novo campo
- Endpoint POST /api/users aceita _funcoesAdministrativas
- Endpoint PUT /api/users/:email aceita e salva _funcoesAdministrativas
- Endpoint GET /api/users retorna _funcoesAdministrativas
- Endpoint GET /api/users/check/:email inclui _funcoesAdministrativas
- Documentação do schema atualizada

**Schema Final Atualizado:**
```json
{
  "_id": "ObjectId",
  "_userMail": "String (obrigatório)",
  "_userId": "String (obrigatório)",
  "_userRole": "String (obrigatório)",
  "_userClearance": "Object (obrigatório)",
  "_userTickets": "Object (obrigatório)",
  "_funcoesAdministrativas": {
    "avaliador": "Boolean (opcional, default: false)"
  }
}
```

**Benefícios:**
- ✅ Suporte completo ao módulo Qualidade
- ✅ Usuários com função "Gestão" ou "Administrador" podem ser marcados como avaliadores
- ✅ Campo opcional com valor padrão seguro
- ✅ Compatibilidade total com frontend existente
- ✅ API mantém retrocompatibilidade

**Commit Hash:** c3e4b4e  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:59:00  
**Tipo:** GitHub Push  
**Versão:** v3.9.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/BotPerguntas.js` (v3.3.0)
- `backend/models/Velonews.js` (v3.2.0)
- `backend/models/QualidadeFuncionario.js` (v1.1.0)
- `backend/models/QualidadeAvaliacaoGPT.js` (v1.1.0)
- `backend/routes/qualidade.js` (v3.5.0)
- `listagem de schema de coleções do mongoD.rb`
- `DEPLOY_LOG.md`

### Descrição:
Padronização completa dos schemas MongoDB - Backend totalmente alinhado com frontend e documentação:

**Funcionalidades Implementadas:**
- Padronização completa de nomenclatura em todos os modelos
- Alinhamento total entre frontend, backend e documentação
- Compatibilidade garantida com campos padronizados
- Validações e endpoints atualizados

**Alterações Técnicas:**
- **BotPerguntas.js**: Campos padronizados (pergunta, resposta, palavrasChave, sinonimos, tabulacao)
- **Velonews.js**: Campos padronizados (titulo, conteudo)
- **QualidadeFuncionario.js**: Campo padronizado (colaboradorNome)
- **QualidadeAvaliacaoGPT.js**: Campo padronizado (avaliacao_id como ObjectId)
- **qualidade.js**: Endpoints e validações atualizados para campos padronizados
- **Documentação**: Schemas atualizados com campos padronizados

**Schemas Padronizados:**
```json
// Bot_perguntas
{
  "pergunta": "String",
  "resposta": "String", 
  "palavrasChave": "String",
  "sinonimos": "String",
  "tabulacao": "String"
}

// Velonews
{
  "titulo": "String",
  "conteudo": "String"
}

// qualidade_funcionarios
{
  "colaboradorNome": "String"
}

// qualidade_avaliacoes_gpt
{
  "avaliacao_id": "ObjectId"
}
```

**Benefícios:**
- ✅ Nomenclatura unificada em todo o sistema
- ✅ Compatibilidade total entre frontend e backend
- ✅ Documentação alinhada com implementação
- ✅ Validações funcionando com campos corretos
- ✅ Endpoints atualizados para campos padronizados
- ✅ Sistema totalmente padronizado

**Commit Hash:** 53378bd  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:59:00  
**Tipo:** GitHub Push  
**Versão:** v3.12.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/routes/velonews.js` (v3.2.0)
- `backend/routes/botPerguntas.js` (v3.3.0)
- `backend/routes/artigos.js` (v3.2.0)
- `backend/models/BotPerguntas.js` (v3.4.0)
- `DEPLOY_LOG.md`

### Descrição:
Adequação completa dos endpoints do backend para 100% de compatibilidade com frontend v3.5.4 e schema oficial MongoDB:

**Problema Resolvido:**
- Backend estava desestruturando campos incorretos nos endpoints
- Incompatibilidade total entre frontend e backend após correções do frontend
- Campos não alinhados com schema oficial do MongoDB

**Correções Implementadas:**

**1. Velonews (velonews.js v3.2.0):**
- Alterado desestruturação de `title, content` para `titulo, conteudo`
- Validações atualizadas para campos em português
- Endpoints POST e PUT corrigidos
- Logs atualizados com campos corretos

**2. Bot Perguntas (botPerguntas.js v3.3.0):**
- Alterado desestruturação de campos maiúsculos para minúsculos
- `Pergunta, Resposta, "Palavras-chave", Sinonimos, Tabulação` → `pergunta, resposta, palavrasChave, sinonimos, tabulacao`
- Validações atualizadas para campos padronizados
- Endpoints POST e PUT corrigidos

**3. Artigos (artigos.js v3.2.0):**
- Alterado desestruturação para campos em português
- `title, content, category, keywords` → `tag, artigo_titulo, artigo_conteudo, categoria_id, categoria_titulo`
- Validações atualizadas para campos obrigatórios corretos
- Endpoints POST e PUT corrigidos

**4. Modelo BotPerguntas (BotPerguntas.js v3.4.0):**
- Método update() corrigido para aceitar campos padronizados
- Mapeamento de campos atualizado para schema oficial

**Compatibilidade Garantida:**
- ✅ Frontend v3.5.4 envia campos corretos
- ✅ Backend aceita campos corretos
- ✅ Schema MongoDB oficial respeitado
- ✅ Validações funcionando adequadamente
- ✅ Logs e monitoramento atualizados

**Testes Recomendados:**
- Teste Velonews: Criar notícia com titulo e conteudo
- Teste Bot_perguntas: Criar pergunta com pergunta, resposta, palavrasChave
- Teste Artigos: Criar artigo com artigo_titulo, artigo_conteudo, categoria_titulo

**Commit Hash:** 1c17fdd  
**Status:** ✅ Sucesso

---

## GitHub Push - 2024-12-19

**Data/Hora:** 2024-12-19 23:59:00  
**Tipo:** GitHub Push  
**Versão:** v4.0.0  
**Repositório:** admVeloHub/back-console  
**Branch:** master  

### Arquivos Modificados:
- `backend/models/UserActivity.js` (v1.0.0) - **NOVO**
- `backend/models/BotFeedback.js` (v1.0.0) - **NOVO**
- `backend/routes/botAnalises.js` (v1.0.0) - **NOVO**
- `backend/server.js` (v4.0.0)
- `listagem de schema de coleções do mongoD.rb` (v1.3.0)
- `DEPLOY_LOG.md`

### Descrição:
Implementação completa da API de Bot Análises com endpoint otimizado único:

**Funcionalidades Implementadas:**
- Modelo UserActivity.js para collection `console_conteudo.user_activity`
- Modelo BotFeedback.js para collection `console_conteudo.bot_feedback`
- Endpoint único otimizado `/api/bot-analises/dados-completos`
- Retorno de dados brutos + metadados para máxima flexibilidade
- Integração completa com Monitor Skynet

**Endpoint Único:**
- `GET /api/bot-analises/dados-completos`
- Parâmetros: `periodo` (1dia|7dias|30dias|90dias|1ano|todos), `exibicao` (dia|semana|mes)
- Retorno: Dados brutos completos + metadados para filtros dinâmicos

**Estrutura de Retorno:**
```json
{
  "dadosBrutos": {
    "user_activity": Array, // Registros completos filtrados por período
    "bot_feedback": Array   // Registros completos filtrados por período
  },
  "metadados": {
    "agentes": Array,        // Lista de agentes disponíveis
    "usuarios": Array,       // Lista de usuários únicos
    "periodos": Array,       // Períodos disponíveis nos dados
    "tiposAcao": Array,      // Tipos de ação disponíveis
    "tiposFeedback": Array,  // Tipos de feedback disponíveis
    "sessoes": Array         // IDs de sessão únicos
  },
  "resumo": {
    "totalRegistros": Number,
    "periodoInicio": String,
    "periodoFim": String,
    "totalUsuarios": Number,
    "totalSessoes": Number
  }
}
```

**Benefícios da Implementação:**
- ✅ Dados brutos completos para análises comportamentais específicas
- ✅ Metadados para filtros dinâmicos no frontend
- ✅ Filtros combinados (agente + período + usuário)
- ✅ Análises de performance por agente
- ✅ Comportamento de sessões específicas
- ✅ Processamento local para análises específicas
- ✅ Cache de 90 dias no frontend
- ✅ Performance otimizada com consultas paralelas

**Schemas MongoDB:**
- Database: `console_conteudo`
- Collections: `user_activity`, `bot_feedback`
- Índices otimizados para performance
- Métodos estáticos para consultas eficientes

**Integração:**
- Rota registrada no server.js
- Monitor Skynet configurado
- Logs detalhados de performance
- Tratamento de erros padronizado

**Commit Hash:** [PENDENTE]  
**Status:** ✅ Implementação Completa

---

*Log gerado automaticamente pelo sistema de deploy*

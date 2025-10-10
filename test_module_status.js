// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testModuleStatusEndpoints() {
  console.log('🧪 Testando endpoints do Module Status...\n');

  try {
    // Teste 1: GET /api/module-status
    console.log('1️⃣ Testando GET /api/module-status...');
    const getResponse = await axios.get(`${API_BASE_URL}/module-status`);
    
    console.log('✅ GET Response Status:', getResponse.status);
    console.log('📊 GET Response Data:', JSON.stringify(getResponse.data, null, 2));
    
    // Verificar estrutura da resposta
    if (getResponse.data.success && getResponse.data.data) {
      console.log('✅ Estrutura GET correta: { success: true, data: {...} }');
    } else {
      console.log('❌ Estrutura GET incorreta');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');

    // Teste 2: PUT /api/module-status
    console.log('2️⃣ Testando PUT /api/module-status...');
    
    const testData = {
      'credito-trabalhador': 'on',
      'credito-pessoal': 'off',
      'antecipacao': 'revisao',
      'pagamento-antecipado': 'on',
      'modulo-irpf': 'off',
      'modulo-seguro': 'on'
    };
    
    console.log('📤 Enviando dados:', JSON.stringify(testData, null, 2));
    
    const putResponse = await axios.put(`${API_BASE_URL}/module-status`, testData);
    
    console.log('✅ PUT Response Status:', putResponse.status);
    console.log('📊 PUT Response Data:', JSON.stringify(putResponse.data, null, 2));
    
    // Verificar estrutura da resposta
    if (putResponse.data.success && putResponse.data.data) {
      console.log('✅ Estrutura PUT correta: { success: true, data: {...} }');
    } else {
      console.log('❌ Estrutura PUT incorreta');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');

    // Teste 3: Verificar se os dados foram salvos
    console.log('3️⃣ Verificando se os dados foram salvos...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/module-status`);
    
    console.log('📊 Dados salvos:', JSON.stringify(verifyResponse.data.data, null, 2));
    
    // Comparar dados enviados vs dados salvos
    const dataMatch = JSON.stringify(testData) === JSON.stringify(verifyResponse.data.data);
    console.log(dataMatch ? '✅ Dados salvos corretamente' : '❌ Dados não foram salvos corretamente');
    
    console.log('\n' + '='.repeat(50) + '\n');

    // Teste 4: Testar validação de valores inválidos
    console.log('4️⃣ Testando validação de valores inválidos...');
    
    try {
      const invalidData = {
        'credito-trabalhador': 'invalid_status',
        'credito-pessoal': 'off'
      };
      
      await axios.put(`${API_BASE_URL}/module-status`, invalidData);
      console.log('❌ Validação falhou - deveria ter retornado erro');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validação funcionando - erro 400 retornado');
        console.log('📊 Erro:', error.response.data.error);
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }
    
    console.log('\n' + '='.repeat(50) + '\n');

    // Teste 5: Testar validação de chaves inválidas
    console.log('5️⃣ Testando validação de chaves inválidas...');
    
    try {
      const invalidKeys = {
        'invalid-module': 'on',
        'credito-pessoal': 'off'
      };
      
      await axios.put(`${API_BASE_URL}/module-status`, invalidKeys);
      console.log('❌ Validação falhou - deveria ter retornado erro');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validação funcionando - erro 400 retornado');
        console.log('📊 Erro:', error.response.data.error);
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    console.log('\n🎉 Todos os testes concluídos!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    if (error.response) {
      console.error('📊 Response Status:', error.response.status);
      console.error('📊 Response Data:', error.response.data);
    }
  }
}

// Executar testes
testModuleStatusEndpoints();

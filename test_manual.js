const http = require('http');

async function testManual() {
  console.log('🧪 Testando fluxo manual...\n');
  
  // 1. Testar acesso ao Harbor
  console.log('1️⃣ Testando acesso ao Harbor...');
  try {
    const harborResponse = await fetch('http://localhost:3701/');
    console.log(`   Status: ${harborResponse.status}`);
    console.log(`   URL final: ${harborResponse.url}`);
    
    if (harborResponse.url.includes('localhost:3700')) {
      console.log('   ✅ Redirecionamento para Quarter funcionou');
    } else {
      console.log('   ❌ Não foi redirecionado para Quarter');
    }
  } catch (error) {
    console.log('   ❌ Erro ao acessar Harbor:', error.message);
  }
  
  // 2. Testar acesso ao Quarter
  console.log('\n2️⃣ Testando acesso ao Quarter...');
  try {
    const quarterResponse = await fetch('http://localhost:3700/');
    console.log(`   Status: ${quarterResponse.status}`);
    console.log(`   URL final: ${quarterResponse.url}`);
    
    if (quarterResponse.url.includes('localhost:3700')) {
      console.log('   ✅ Quarter está acessível');
    } else {
      console.log('   ❌ Quarter não está acessível');
    }
  } catch (error) {
    console.log('   ❌ Erro ao acessar Quarter:', error.message);
  }
  
  // 3. Testar redirecionamento com parâmetro
  console.log('\n3️⃣ Testando redirecionamento com parâmetro...');
  try {
    const redirectUrl = encodeURIComponent('http://localhost:3701/');
    const quarterWithRedirect = await fetch(`http://localhost:3700/?redirect_to=${redirectUrl}`);
    console.log(`   Status: ${quarterWithRedirect.status}`);
    console.log(`   URL final: ${quarterWithRedirect.url}`);
    
    if (quarterWithRedirect.url.includes('localhost:3700')) {
      console.log('   ✅ Quarter com redirect_to está acessível');
    } else {
      console.log('   ❌ Quarter com redirect_to não está acessível');
    }
  } catch (error) {
    console.log('   ❌ Erro ao testar redirecionamento:', error.message);
  }
  
  console.log('\n📋 Resumo:');
  console.log('   - Harbor: http://localhost:3701/');
  console.log('   - Quarter: http://localhost:3700/');
  console.log('   - Credenciais: admin@canonika.io / admin123');
  console.log('\n💡 Para testar manualmente:');
  console.log('   1. Abra http://localhost:3701/ no browser');
  console.log('   2. Deve redirecionar para http://localhost:3700/');
  console.log('   3. Faça login com admin@canonika.io / admin123');
  console.log('   4. Deve voltar para http://localhost:3701/');
}

testManual(); 
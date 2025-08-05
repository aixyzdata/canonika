const http = require('http');

const services = [
  { name: 'Quarter', port: 3700, url: 'http://localhost:3700' },
  { name: 'Harbor', port: 3701, url: 'http://localhost:3701' },
  { name: 'Skipper', port: 3702, url: 'http://localhost:3702' },
  { name: 'Beacon', port: 3703, url: 'http://localhost:3703' },
  { name: 'Guardian', port: 3705, url: 'http://localhost:3705' },
  { name: 'Fisher', port: 3706, url: 'http://localhost:3706' },
  { name: 'Tollgate', port: 3707, url: 'http://localhost:3707' },
  { name: 'Ledger', port: 3708, url: 'http://localhost:3708' }
];

async function checkService(service) {
  return new Promise((resolve) => {
    const req = http.get(service.url, (res) => {
      console.log(`✅ ${service.name} (${service.port}): ${res.statusCode}`);
      resolve({ service, status: 'online', code: res.statusCode });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${service.name} (${service.port}): Offline`);
      resolve({ service, status: 'offline', error: err.message });
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${service.name} (${service.port}): Timeout`);
      req.destroy();
      resolve({ service, status: 'timeout' });
    });
  });
}

async function checkAllServices() {
  console.log('🔍 Verificando serviços Canonika...\n');
  
  const results = await Promise.all(services.map(checkService));
  
  console.log('\n📊 Resumo:');
  const online = results.filter(r => r.status === 'online').length;
  const offline = results.filter(r => r.status === 'offline').length;
  const timeout = results.filter(r => r.status === 'timeout').length;
  
  console.log(`✅ Online: ${online}`);
  console.log(`❌ Offline: ${offline}`);
  console.log(`⏰ Timeout: ${timeout}`);
  
  if (online >= 2) {
    console.log('\n🎉 Serviços principais estão online!');
    console.log('💡 Para testar o fluxo: node test_fluxo_harbor.js');
  } else {
    console.log('\n⚠️  Alguns serviços estão offline.');
    console.log('💡 Execute: ./start-canonika.sh');
  }
}

checkAllServices(); 
require('dotenv').config();
const { InfisicalSDK } = require('@infisical/sdk');
const buildApp = require('./app');
const { connect, close } = require('./config/rabbitmq');

const PORT = Number(process.env.PORT) || 9501;

async function start() {
  try {
    // Define a URL base dependendo se estás no Windows ou dentro do Docker
    const siteUrl = process.env.NODE_ENV === 'production' 
      ? "http://host.docker.internal:8081" 
      : "http://localhost:8081";

    const client = new InfisicalSDK({
      siteUrl: siteUrl
    });

    console.log(`[Infisical] Tentando estabelecer ligação em ${siteUrl}...`);

    // 1. Autenticação na Machine Identity
    await client.auth().universalAuth.login({
      clientId: process.env.INFISICAL_CLIENT_ID,
      clientSecret: process.env.INFISICAL_CLIENT_SECRET
    });

    console.log('[Infisical] Login efetuado com sucesso!');

    // 2. Procura dos segredos do projeto
    // A resposta agora contém um objeto com a propriedade 'secrets'
    const response = await client.secrets().listSecrets({
      environment: "dev", 
      projectId: process.env.INFISICAL_PROJECT_ID
    });

    // 3. Injeção dos segredos no process.env
    if (response && response.secrets) {
      response.secrets.forEach(s => {
        process.env[s.secretKey] = s.secretValue;
      });
      console.log('[Infisical] Segredos carregados e injetados com sucesso!');
    } else {
      console.warn('[Infisical] Aviso: Nenhum segredo encontrado para este ambiente.');
    }

    // 4. Inicia a ligação ao RabbitMQ (já com a URL vinda do Infisical)
    await connect().catch((err) => {
      console.error('[RabbitMQ] Erro na ligação inicial:', err.message);
    });

    const fastify = buildApp();

    // 5. Inicia o servidor Fastify
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[Server] Microsserviço de Usuários a correr na porta ${PORT}`);

  } catch (err) {
    // Log detalhado para identificar falhas de permissão ou rede
    const errorMessage = err.response?.data?.message || err.message;
    console.error('[Server] Erro crítico na inicialização:', errorMessage);
    process.exit(1);
  }

  // Lógica para encerramento controlado (Graceful Shutdown)
  const shutdown = async (signal) => {
    console.log(`[Server] Sinal ${signal} recebido. A encerrar...`);
    if (typeof close === 'function') {
      await close(); // Encerra a ligação ao RabbitMQ
    }
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start();
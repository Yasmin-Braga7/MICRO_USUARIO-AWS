/**
 * server.js
 * Ordem de boot:
 * 1. dotenv       (desenvolvimento local)
 * 2. Infisical    (produção — carrega secrets do vault)
 * 3. RabbitMQ     (conecta em background, não bloqueia)
 * 4. Fastify      (sobe o servidor HTTP)
 */
require('dotenv').config();

const { loadSecrets }    = require('./config/infisical');
const { connect, close } = require('./config/rabbitmq');

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  // 1. Carrega secrets do Infisical (em produção) PRIMEIRO
  await loadSecrets();

  // 2. SÓ AGORA importamos o app, para garantir que o process.env.JWT_SECRET já existe
  const buildApp = require('./app');

  // 3. Conecta ao RabbitMQ em background
  connect().catch((err) => {
    console.error('[RabbitMQ] Erro inicial (tentará reconectar):', err.message);
  });

  // 4. Sobe o servidor HTTP
  const fastify = await buildApp();

  console.log('--- Rotas Registradas ---');
  console.log(fastify.printRoutes());
  console.log('-------------------------');

  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[Server] Microsserviço de Usuários rodando na porta ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // 5. Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`[Server] ${signal} recebido. Encerrando...`);
    await fastify.close();
    await close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

start();
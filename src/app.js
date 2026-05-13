const Fastify = require('fastify');
const usuarioRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth'); // Novo import para autenticação
const prismaPlugin = require('./plugins/prisma');

function buildApp(opts = {}) {
  const fastify = Fastify({ logger: true, ...opts });

  // Plugin do Prisma
  fastify.register(prismaPlugin);

  // Health check
  fastify.get('/health', async () => ({ status: 'ok', servico: 'usuarios' }));

  // Registo de Rotas
  fastify.register(usuarioRoutes, { prefix: '/usuarios' });
  fastify.register(authRoutes, { prefix: '/auth' }); // Registo das rotas de login e validação

  return fastify;
}

module.exports = buildApp;
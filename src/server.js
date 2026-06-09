require('dotenv').config();
const { loadSecrets } = require('./config/infisical');

// Configura a porta correta do microsserviço (9501)
const PORT = Number(process.env.PORT) || 9501;

const start = async () => {
    try {
        // 1. Carrega os secrets do Infisical PRIMEIRO
        await loadSecrets();

        // 2. APENAS AGORA importamos o app.js para garantir que as variáveis
        // de ambiente (como o JWT_SECRET injetado pelo Infisical) já estão disponíveis
        const buildApp = require('./app');
        const fastify = buildApp({ logger: true });
        
        const { connect, close } = require('./config/rabbitmq');

        // 3. Conexão com o broker do RabbitMQ
        await connect();

        // 4. Sobe o servidor HTTP na porta dinâmica corrigida
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`[Server] Microsserviço de Usuários a correr perfeitamente na porta ${PORT}`);
        
        // 5. Graceful shutdown para encerrar os processos de forma limpa
        const shutdown = async (signal) => {
            console.log(`[Server] ${signal} recebido. A encerrar...`);
            await fastify.close();
            await close();
            process.exit(0);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT',  () => shutdown('SIGINT'));

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
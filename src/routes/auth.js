const authCtrl = require('../controllers/authController');

async function authRoutes(fastify) {
  fastify.post('/login', authCtrl.login);
  fastify.post('/refresh', authCtrl.refresh);
  fastify.post('/validate', authCtrl.validarToken); // Usamos POST ou GET dependendo de como passar o token
}

module.exports = authRoutes;
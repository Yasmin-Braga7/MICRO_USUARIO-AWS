const authService = require('../services/authService');

async function login(req, reply) {
  try {
    const { email, senha } = req.body;
    const data = await authService.login(email, senha);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(401).send({ success: false, error: error.message });
  }
}

async function refresh(req, reply) {
  try {
    const data = await authService.refresh(req.body.token);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(401).send({ success: false, error: error.message });
  }
}

async function validarToken(req, reply) {
  // Pega o token do cabeçalho de autorização ou do corpo
  const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token;
  if (!token) return reply.status(400).send({ success: false, error: 'Token não fornecido' });

  const data = await authService.validarToken(token);
  return reply.send({ success: true, data });
}

// Fica aqui porque a rota é /usuarios/:id/senha
async function alterarSenha(req, reply) {
  try {
    const { senhaatual, novasenha } = req.body;
    await authService.alterarSenha(req.params.id, senhaatual, novasenha);
    return reply.send({ success: true, message: 'Palavra-passe alterada com sucesso' });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

module.exports = { login, refresh, validarToken, alterarSenha };
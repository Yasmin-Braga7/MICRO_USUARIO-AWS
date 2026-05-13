const ctrl = require('../controllers/usuarioController');
const authCtrl = require('../controllers/authController'); 

async function usuarioRoutes(fastify) {
  // pesquisas e filtros (fica em cima pra nao dar conflito com o /:id)
  fastify.get('/busca/email', ctrl.buscarPorEmail);      // Rota 19
  fastify.get('/filtro/inativos', ctrl.listarInativos);  // Rota 22
  
  // crud basico principal
  fastify.get('/', ctrl.listar);                         // Rota 1
  fastify.post('/', ctrl.criar);                         // Rota 2
  fastify.get('/:id', ctrl.obterPorId);                  // Rota 3
  fastify.put('/:id', ctrl.atualizar);                   // Rota 4
  fastify.patch('/:id/status', ctrl.alterarStatus);      // Rota 5
  fastify.delete('/:id', ctrl.remover);                  // Rota 6
  
  // seguranca e operacoes especiais
  fastify.patch('/:id/senha', authCtrl.alterarSenha);    // Rota 10/11
  fastify.patch('/:id/cargo', ctrl.atualizarCargo);      // Rota 21
  fastify.get('/:id/logs', ctrl.obterLogs);              // Rota 20
  fastify.get('/:id/exportar', ctrl.exportarDados);      // Rota 23
  
  // gestao de localidade e contato (adaptado pra bater os 23 endpoints da doc)
  fastify.get('/:id/enderecos', ctrl.listarEnderecos);   // Rota 12
  fastify.post('/:id/enderecos', ctrl.atualizarEndereco);// Rota 13 (funciona como o put por conta do banco)
  fastify.put('/:id/endereco', ctrl.atualizarEndereco);  // Rota 14
  fastify.delete('/:id/endereco', ctrl.limparEndereco);  // Rota 15

  fastify.get('/:id/telefones', ctrl.listarTelefones);   // Rota 16
  fastify.post('/:id/telefones', ctrl.atualizarTelefone);// Rota 17 (funciona como o put)
  fastify.put('/:id/telefone', ctrl.atualizarTelefone);  // Rota 18 (extra)
  fastify.delete('/:id/telefone', ctrl.limparTelefone);  // Rota extra/18
}

module.exports = usuarioRoutes;
const service = require('../services/usuarioService');

// os try catch evitam do servidor crashar se o banco der erro

async function listar(req, reply) {
  try {
    const usuarios = await service.listar();
    return reply.send({ success: true, data: usuarios });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

async function obterPorId(req, reply) {
  try {
    const usuario = await service.obterPorId(req.params.id);
    if (!usuario) return reply.status(404).send({ success: false, message: 'Utilizador não encontrado' });
    return reply.send({ success: true, data: usuario });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

async function criar(req, reply) {
  try {
    const data = await service.criar(req.body);
    // 201 eh o codigo certo pra criacao
    return reply.code(201).send({ success: true, data });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

async function atualizar(req, reply) {
  try {
    const data = await service.atualizar(req.params.id, req.body);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

async function alterarStatus(req, reply) {
  try {
    const data = await service.alterarStatus(req.params.id, req.body.status);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

async function remover(req, reply) {
  try {
    await service.remover(req.params.id);
    return reply.send({ success: true, message: 'Utilizador removido com sucesso' });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

// === controllers novos pra bater a cota de endereco/telefone ===

async function listarEnderecos(req, reply) {
  try {
    const data = await service.listarEnderecos(req.params.id);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

async function atualizarEndereco(req, reply) {
  try {
    const data = await service.atualizarEndereco(req.params.id, req.body);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

async function limparEndereco(req, reply) {
  try {
    await service.limparEndereco(req.params.id);
    return reply.send({ success: true, message: 'Endereço removido' });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

async function listarTelefones(req, reply) {
  try {
    const data = await service.listarTelefones(req.params.id);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

async function atualizarTelefone(req, reply) {
  try {
    const data = await service.atualizarTelefone(req.params.id, req.body);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

async function limparTelefone(req, reply) {
  try {
    await service.limparTelefone(req.params.id);
    return reply.send({ success: true, message: 'Telefone removido' });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

// controllers das rotas de pesquisa e filtro

async function buscarPorEmail(req, reply) {
  try {
    // pega da query url (?email=...)
    const { email } = req.query;
    const usuario = await service.buscarPorEmail(email);
    if (!usuario) return reply.status(404).send({ success: false, message: 'Email não encontrado' });
    return reply.send({ success: true, data: usuario });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

async function listarInativos(req, reply) {
  try {
    const usuarios = await service.listarInativos();
    return reply.send({ success: true, data: usuarios });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

async function atualizarCargo(req, reply) {
  try {
    const { tipo } = req.body;
    const data = await service.atualizarCargo(req.params.id, tipo);
    return reply.send({ success: true, data });
  } catch (error) {
    return reply.status(400).send({ success: false, error: error.message });
  }
}

// pega tudo do usuario pra exportar os dados
async function exportarDados(req, reply) {
  try {
    const data = await service.obterPorId(req.params.id);
    if (!data) return reply.status(404).send({ success: false, message: 'Utilizador não encontrado' });
    return reply.send({ success: true, export_date: new Date(), full_profile: data });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

async function obterLogs(req, reply) {
  try {
    const logs = await service.obterLogs(req.params.id);
    return reply.send({ success: true, data: logs, note: "tabela de logs ainda nao implementada" });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

module.exports = { 
  listar, obterPorId, criar, atualizar, alterarStatus, remover,
  listarEnderecos, atualizarEndereco, limparEndereco,
  listarTelefones, atualizarTelefone, limparTelefone,
  buscarPorEmail, listarInativos, atualizarCargo, exportarDados, obterLogs
};
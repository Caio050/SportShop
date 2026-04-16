import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('sportshop.db');
    await initDB(db);
  }
  return db;
}

async function initDB(database) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      descricao TEXT,
      imagem TEXT,
      categoria TEXT DEFAULT 'Geral',
      estoque INTEGER DEFAULT 0,
      criado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT,
      total REAL,
      status TEXT DEFAULT 'Pendente',
      criado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER,
      produto_id INTEGER,
      nome TEXT,
      preco REAL,
      quantidade INTEGER,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    );
  `);

  // Seed if empty
  const count = await database.getFirstAsync('SELECT COUNT(*) as total FROM produtos');
  if (count.total === 0) {
    await database.execAsync(`
      INSERT INTO produtos (nome, preco, descricao, imagem, categoria, estoque) VALUES
      ('Bola de Basquete Oficial', 189.90, 'Bola de basquete tamanho oficial NBA, couro sintético de alta durabilidade. Ideal para quadras indoor e outdoor. Grip superior para máximo controle.', 'https://images.unsplash.com/photo-1625038627556-966ed84eaa97?w=600', 'Basquete', 15),
      ('Camisa Adidas Performance', 199.90, 'Camisa esportiva com tecnologia Climalite que afasta o suor do corpo mantendo você seco e confortável durante toda a atividade física.', 'https://images.unsplash.com/photo-1621573094640-0b2391e9acec?w=600', 'Roupas', 30),
      ('Bola de Futebol Oficial', 149.90, 'Bola de futebol campo tamanho 5, costurada à mão com material de alta resistência. Aprovada para uso em competições amadoras e profissionais.', 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=600', 'Futebol', 20),
      ('Luva de Academia', 79.90, 'Luva para musculação com proteção de palma em couro e velcro ajustável. Proporciona melhor pegada e protege contra calosidades.', 'https://images.unsplash.com/photo-1592060812772-5bc4b3b3a97a?w=600', 'Academia', 25),
      ('Tênis Nike Air Zoom', 499.90, 'Tênis de corrida com tecnologia Air Zoom que proporciona amortecimento reativo a cada passada. Solado com tração multidirecional para maior estabilidade.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'Calçados', 12),
      ('Raquete de Tênis Wilson', 350.00, 'Raquete profissional em grafite com frame 27 polegadas. Ideal para jogadores intermediários e avançados que buscam potência e controle.', 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600', 'Tênis', 8);
    `);
  }
}

// ===== PRODUTOS =====
export async function getProdutos() {
  const database = await getDB();
  return await database.getAllAsync('SELECT * FROM produtos ORDER BY id DESC');
}

export async function getProdutoById(id) {
  const database = await getDB();
  return await database.getFirstAsync('SELECT * FROM produtos WHERE id = ?', [id]);
}

export async function criarProduto(nome, preco, descricao, imagem, categoria, estoque) {
  const database = await getDB();
  const result = await database.runAsync(
    'INSERT INTO produtos (nome, preco, descricao, imagem, categoria, estoque) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, parseFloat(preco), descricao, imagem, categoria, parseInt(estoque) || 0]
  );
  return result.lastInsertRowId;
}

export async function atualizarProduto(id, nome, preco, descricao, imagem, categoria, estoque) {
  const database = await getDB();
  await database.runAsync(
    'UPDATE produtos SET nome = ?, preco = ?, descricao = ?, imagem = ?, categoria = ?, estoque = ? WHERE id = ?',
    [nome, parseFloat(preco), descricao, imagem, categoria, parseInt(estoque) || 0, id]
  );
}

export async function deletarProduto(id) {
  const database = await getDB();
  await database.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
}

// ===== PEDIDOS =====
export async function getPedidos() {
  const database = await getDB();
  return await database.getAllAsync('SELECT * FROM pedidos ORDER BY criado_em DESC');
}

export async function criarPedido(cliente, total, itens) {
  const database = await getDB();
  const result = await database.runAsync(
    'INSERT INTO pedidos (cliente, total, status) VALUES (?, ?, ?)',
    [cliente || 'Cliente', total, 'Pendente']
  );
  const pedidoId = result.lastInsertRowId;
  for (const item of itens) {
    await database.runAsync(
      'INSERT INTO itens_pedido (pedido_id, produto_id, nome, preco, quantidade) VALUES (?, ?, ?, ?, ?)',
      [pedidoId, item.id, item.nome || item.name, item.preco || parseFloat(item.price?.replace('R$ ', '').replace(',', '.')), item.quantity]
    );
  }
  return pedidoId;
}

export async function getItensPedido(pedidoId) {
  const database = await getDB();
  return await database.getAllAsync('SELECT * FROM itens_pedido WHERE pedido_id = ?', [pedidoId]);
}

export async function atualizarStatusPedido(id, status) {
  const database = await getDB();
  await database.runAsync('UPDATE pedidos SET status = ? WHERE id = ?', [status, id]);
}

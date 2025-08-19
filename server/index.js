// 1. Importar as dependências
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 2. Inicializar o Express
const app = express();
const port = 3000;

// 3. Configurar Middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar ao Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

//============================================
// ROTAS DE AUTENTICAÇÃO
//============================================
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ user: data.user, message: 'Usuário criado com sucesso.' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Credenciais inválidas.' });
  res.status(200).json({ user: data.user, session: data.session });
});

//============================================
// MIDDLEWARE DE PROTEÇÃO
//============================================
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado: Token não fornecido.' });
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Não autorizado: Token inválido.' });
  }
  req.user = user;
  next();
};

//============================================
// ROTAS DO CRUD DE LIVROS (PROTEGIDAS)
//============================================
app.get('/api/books', authMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('books').select('*').eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
});

app.post('/api/books', authMiddleware, async (req, res) => {
  // --- LINHA ADICIONADA PARA DEBUG ---
  console.log('Recebido para criar livro:', req.body); 

  const { title, author, year, image } = req.body;
  const userId = req.user.id;

  if (!title || !author) {
    return res.status(400).json({ error: 'Título e autor são obrigatórios.' });
  }

  const { data, error } = await supabase
    .from('books')
    .insert([{ title, author, year, image, user_id: userId }])
    .select();

  if (error) {
    console.error('Erro do Supabase ao inserir:', error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

app.put('/api/books/:id', authMiddleware, async (req, res) => {
    const { title, author, year, image } = req.body;
    const { data, error } = await supabase.from('books').update({ title, author, year, image }).eq('id', req.params.id).eq('user_id', req.user.id).select();
    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Livro não encontrado ou não autorizado.' });
    res.status(200).json(data[0]);
});

app.delete('/api/books/:id', authMiddleware, async (req, res) => {
    const { error } = await supabase.from('books').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
});

// 5. Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


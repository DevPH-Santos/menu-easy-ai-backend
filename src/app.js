const express = require('express');
const cors = require('cors'); 
const app = express();

const usuarioRoutes = require('./routes/usuarioRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

app.use(cors());
app.use(express.json());

// rotas existentes
app.use('/api/usuarios', usuarioRoutes);

// rotas de produtos
app.use('/api/produtos', produtoRoutes); 

const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const pedidoRoutes = require('./routes/pedidosRoutes');
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/pedidos', pedidoRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

module.exports = app;
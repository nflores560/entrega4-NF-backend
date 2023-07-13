const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const exphbs = require('express-handlebars');

// Configuración de Express y Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configuración del directorio de vistas
app.set('views', __dirname + '/views');

// Configuración del servidor de archivos estáticos
app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// Configuración del WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Escucha el evento 'newProduct' desde el cliente
  socket.on('newProduct', (product) => {
    // lógica para guardar el nuevo producto en la base de datos

    // Emite el evento 'newProduct' a todos los clientes conectados
    io.emit('newProduct', product);
  });

  // Escucha el evento 'deleteProduct' desde el cliente
  socket.on('deleteProduct', (productId) => {
    // lógica para eliminar el producto de la base de datos

    // Emite el evento 'deleteProduct' a todos los clientes conectados
    io.emit('deleteProduct', productId);
  });

  // Maneja la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Inicia el servidor
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});


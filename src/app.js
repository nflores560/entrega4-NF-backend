import express from "express";
import productsRouter from './routes/productsRouter';
import cartsRouter from './routes/cartsRouter';
import __dirname from './utils';
import handlebars from "express-handlebars";
import viewsRouter from './routes/views.router';
import { Server } from 'socket.io';
    
const app = express();
const ProductManager = require('./managers/ProductManager.js');
const httpServer = app.listen(8080, () => console.log("Listening on PORT 8080"));

//creo un servidor para socket
const socketServer = new Server(httpServer); 

//config de plantillas
app.engine('handlebars', handlebars, engine());
app.set('views', __dirname, '/views');
app.set('viewe engine', handlebars);
app.use(express.static((`${__dirname}/public`)));
app.use('/', viewsRouter);

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado")
    socket.on('message', data => {
        console.log(data);
    })
    
});

//parámetros de config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/products', (req, res) => {
    res.send(users);
});



app.listen(8080, () => console.log("Listening 8080"));

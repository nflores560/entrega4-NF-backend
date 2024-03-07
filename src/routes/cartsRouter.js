import { Router } from 'express';
import CartManager from '../managers/CartManager';

const router = Router();

const cartManager = new CartManager();

const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Rutas para carritos.
const cartsRouter = express.Router();

// Ruta POST /api/carts/
app.post('/', (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: [],
  };

  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const carts = JSON.parse(data);
    carts.push(newCart);

    fs.writeFile('carrito.json', JSON.stringify(carts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.status(201).json(newCart);
    });
  });
});

// Ruta GET /api/carts/:cid
app.get('/:cid', (req, res) => {
  const cartId = req.params.cid;

  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
  });
});

// Ruta POST /api/carts/:cid/product/:pid
app.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find((p) => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    fs.writeFile('carrito.json', JSON.stringify(carts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.json(cart);
    });
  });
});

app.use('/api/carts', cartsRouter);

// Iniciar el servidor en el puerto 8080.
  app.listen(8080, () => {
    console.log('Server running in port 8080')
  });
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Rutas para productos
const productsRouter = express.Router();

// Ruta raíz GET /api/products/
app.get('/products', (req, res) => {
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const products = JSON.parse(data);
    res.json(products);
  });
});


// Ruta GET /api/products/:pid
app.get('/:pid', (req, res) => {
  const productId = req.params.pid;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  });
});


// Ruta POST /api/products/
app.post('/', (req, res) => {
  const newProduct = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails,
  };

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const products = JSON.parse(data);
    products.push(newProduct);

    fs.writeFile('productos.json', JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.status(201).json(newProduct);
    });
  });
});

// Ruta PUT /api/products/:pid
app.put('/:pid', (req, res) => {
  const productId = req.params.pid;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar los campos del producto.
    product.title = req.body.title;
    product.description = req.body.description;
    product.code = req.body.code;
    product.price = req.body.price;
    product.status = req.body.status;
    product.stock = req.body.stock;
    product.category = req.body.category;
    product.thumbnails = req.body.thumbnails;

    fs.writeFile('productos.json', JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.json(product);
    });
  });
});

// Ruta DELETE /api/products/:pid
app.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    fs.writeFile('productos.json', JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.json(deletedProduct);
    });
  });
});

app.use('/api/products', productsRouter);
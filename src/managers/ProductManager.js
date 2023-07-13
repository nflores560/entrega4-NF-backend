const fs = require('fs');


class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data);
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    if (this.products.length === 0) {
      product.id = 1;
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
    }

    this.products.push(product);
    this.saveProducts();
  }

  getProductById(idProduct) {
    const productIndex = this.products.findIndex(product => product.id === idProduct);

    if (productIndex === -1) {
      console.log("Not found");
      return;
    }

    const product = this.products[productIndex];
    console.log(`Product: ${product.title}`);
  }

  updateProduct(idProduct, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === idProduct);

    if (productIndex === -1) {
      console.log("Not found");
      return;
    }

    const product = this.products[productIndex];
    this.products[productIndex] = { ...product, ...updatedFields };
    this.saveProducts();
  }

  deleteProduct(idProduct) {
    const productIndex = this.products.findIndex(product => product.id === idProduct);

    if (productIndex === -1) {
      console.log("Not found");
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/products', (req, res) => {
    const limit = req.query.limit;

    if(limit) {
        const limitedProducts = gestionadorProductos.getProducts().slice(0, limit);
        res.json(limitedProducts);
    } else {
        const allProducts = gestionadorProductos.getProducts();
        res.json(allProducts);
    }
});

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = gestionadorProductos.getProductById(productId);

    if(product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = ProductManager;
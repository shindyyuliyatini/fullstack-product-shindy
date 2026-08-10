const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number
});
const Product = mongoose.model('Product', ProductSchema);

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Name dan price wajib diisi' 
});
    }
    const product = new Product({ name, price });
    await product.save();
    res.status(201).json(product);
});

app.put('/api/products/:id', async (req, res) => {
    const { name, price } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, 
price }, { new: true });
    if (!product) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json(product);
});

app.delete('/api/products/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Produk dihapus' });
});
// Route root
app.get('/', (req, res) => {
    res.send('🚀 Backend Product Manager is running!');
});
app.listen(port, () => {
    console.log('Backend running on http://localhost:' + port);
});

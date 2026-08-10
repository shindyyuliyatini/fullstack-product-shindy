import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Nama dan harga harus diisi!');
      return;
    }
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: parseInt(price) })
    });
    const data = await res.json();
    setProducts([...products, data]);
    setName('');
    setPrice('');
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/products/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: parseInt(price) })
    });
    const data = await res.json();
    setProducts(products.map(p => p._id === editingId ? data : p));
    setName('');
    setPrice('');
    setEditingId(null);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const editProduct = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditingId(product._id);
  };

  return (
    <div className="container">
      <h1>📦 Product Manager</h1>

      <form className="form" onSubmit={editingId ? updateProduct : addProduct}>
        <input
          className="input"
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input-price"
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          {editingId ? 'Update' : 'Tambah'}
        </button>
        {editingId && (
          <button className="btn btn-danger" type="button" onClick={() => {
            setName('');
            setPrice('');
            setEditingId(null);
          }}>
            Batal
          </button>
        )}
      </form>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product._id}>
            <div>
              <span className="product-name">{product.name}</span>
              <span className="product-price">Rp {product.price.toLocaleString()}</span>
            </div>
            <div>
              <button className="btn btn-success" onClick={() => 
editProduct(product)}>Edit</button>
              <button className="btn btn-danger" onClick={() => 
deleteProduct(product._id)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

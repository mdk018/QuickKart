import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import PriceChart from './PriceChart';
import './App.css';
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError('');
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);

        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };


  const handleRemoveProduct = async (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to stop tracking this product?');
    if (!confirmDelete) return;
  
    try {
      // Make DELETE request to backend
      //await axios.delete(`http://localhost:5000/api/products/${productId}`);
      await axios.delete(`${BASE_URL}/api/products/${productId}`);

  
      // Update the state to remove the deleted product locally
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
  
      // Clear selected product if it was deleted
      if (selectedProduct?._id === productId) {
        setSelectedProduct(null);
      }
    } catch (error) {
      alert('Failed to remove product. Please try again.');
      console.error('Remove product error:', error);
    }
  };
  

  return (
    <div className="app-container">
      <h1 className="app-title">QuickKart Price Tracker</h1>

      <ProductForm onAdded={handleProductAdded} />

      {loadingProducts && <p>Loading products...</p>}
      {error && <p className="error-text">{error}</p>}

      <ProductList
        products={products}
        onSelect={setSelectedProduct}
        selectedId={selectedProduct?._id}
        onRemove={handleRemoveProduct}
      />

      {selectedProduct && <PriceChart productId={selectedProduct._id} />}
    </div>
  );
}

export default App;

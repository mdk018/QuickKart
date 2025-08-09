import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

function ProductForm({ onAdded }) {
  const [form, setForm] = useState({
    title: '',
    url: '',
    targetPrice: '',
    userEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isFormValid = () => {
    return (
      form.title.trim() !== '' &&
      form.url.trim() !== '' &&
      form.targetPrice !== '' &&
      !isNaN(form.targetPrice) &&
      Number(form.targetPrice) > 0 &&
      validateEmail(form.userEmail)
    );
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setMessage({ type: 'error', text: 'Please fill all fields correctly.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post('http://localhost:5000/api/products', {
        ...form,
        targetPrice: Number(form.targetPrice),
      });
      onAdded(res.data);
      setForm({
        title: '',
        url: '',
        targetPrice: '',
        userEmail: '',
      });
      setMessage({ type: 'success', text: 'Product added successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add product. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        name="title"
        placeholder="Product Title"
        value={form.title}
        onChange={handleChange}
        disabled={loading}
      />
      <input
        type="url"
        name="url"
        placeholder="Product URL"
        value={form.url}
        onChange={handleChange}
        disabled={loading}
      />
      <input
        type="number"
        name="targetPrice"
        placeholder="Target Price (₹)"
        value={form.targetPrice}
        onChange={handleChange}
        disabled={loading}
        min="1"
      />
      <input
        type="email"
        name="userEmail"
        placeholder="Your Email"
        value={form.userEmail}
        onChange={handleChange}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !isFormValid()}>
        {loading ? 'Tracking...' : 'Track Product'}
      </button>
      {message && (
        <p className={message.type === 'error' ? 'error-text' : 'success-text'}>
          {message.text}
        </p>
      )}
    </form>
  );
}

export default ProductForm;

import React from 'react';
import './ProductList.css';

function ProductList({ products, onSelect, selectedId, onRemove }) {
  if (!products.length) return <p>No products tracked yet.</p>;

  return (
    <div className="product-list">
      <h2>Tracked Products</h2>
      <ul>
        {products.map((product) => (
          <li
            key={product._id}
            className={selectedId === product._id ? 'selected' : ''}
            onClick={() => onSelect(product)}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') onSelect(product);
            }}
          >
            {product.title}{' '}
            <span className="target-price">[Target: ₹{product.targetPrice}]</span>
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent selecting on remove
                onRemove(product._id);
              }}
              title="Remove product"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;

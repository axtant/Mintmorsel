import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const [count, setCount] = useState(0);

  return (
    <div className="product-card">
      <p>{product.name}</p>
      <div className="counter">
        <button onClick={() => setCount(count - 1)} disabled={count === 0}>-</button>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
    </div>
  );
};

export default ProductCard;

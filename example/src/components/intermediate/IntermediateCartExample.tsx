import { useIntermediateCartStore } from '../../store';
import { CartTotalsDisplay } from './CartTotalsDisplay';

export function IntermediateCartExample() {
  const items = useIntermediateCartStore((state) => state.items);
  const taxRate = useIntermediateCartStore((state) => state.taxRate);
  const discountPercent = useIntermediateCartStore((state) => state.discountPercent);
  const addItem = useIntermediateCartStore((state) => state.addItem);
  const updateQuantity = useIntermediateCartStore((state) => state.updateQuantity);
  const removeItem = useIntermediateCartStore((state) => state.removeItem);
  const setTaxRate = useIntermediateCartStore((state) => state.setTaxRate);
  const setDiscount = useIntermediateCartStore((state) => state.setDiscount);
  const clearCart = useIntermediateCartStore((state) => state.clearCart);

  return (
    <div className="example-section">
      <div className="card">
        <h2>3. Shopping Cart with Chained Getters (without immer)</h2>

        <div style={{ display: 'flex', gap: '0.5em', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => addItem({ id: 'apple', name: 'Apple', price: 2.5 })}>
            Add Apple ($2.50)
          </button>
          <button onClick={() => addItem({ id: 'banana', name: 'Banana', price: 1.5 })}>
            Add Banana ($1.50)
          </button>
          <button onClick={() => addItem({ id: 'orange', name: 'Orange', price: 3.0 })}>
            Add Orange ($3.00)
          </button>
          <button onClick={() => addItem({ id: 'mango', name: 'Mango', price: 4.0 })}>
            Add Mango ($4.00)
          </button>
        </div>

        {items.length > 0 && (
          <div style={{ margin: '1em 0' }}>
            <h3>Cart Items:</h3>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5em',
                    borderBottom: '1px solid #333',
                    gap: '1em',
                  }}
                >
                  <span>
                    {item.name} (${item.price})
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    style={{ width: '60px', padding: '0.3em' }}
                  />
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ margin: '1.5em 0' }}>
          <div style={{ marginBottom: '0.5em' }}>
            <label>
              Discount: {discountPercent}%
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscount(Number(e.target.value))}
                style={{ marginLeft: '1em' }}
              />
            </label>
          </div>
          <div>
            <label>
              Tax Rate: {(taxRate * 100).toFixed(0)}%
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={taxRate * 100}
                onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
                style={{ marginLeft: '1em' }}
              />
            </label>
          </div>
        </div>

        <CartTotalsDisplay />

        <div className="controls">
          <button onClick={clearCart} disabled={items.length === 0}>
            Clear Cart
          </button>
        </div>

        <div className="info-display">
          <strong>Chained Getters:</strong>
          <pre style={{ textAlign: 'left', fontSize: '0.8em' }}>
            {`get subtotal() { 
  return this.items.reduce((sum, item) => 
    sum + item.price * item.quantity, 0); 
}
get discount() { 
  return this.subtotal * (this.discountPercent / 100); 
}
get subtotalAfterDiscount() { 
  return this.subtotal - this.discount; 
}
get tax() { 
  return this.subtotalAfterDiscount * this.taxRate; 
}
get total() { 
  return this.subtotalAfterDiscount + this.tax; 
}`}
          </pre>
          <p>✨ Each getter can reference other getters - they all stay reactive!</p>
        </div>
      </div>
    </div>
  );
}

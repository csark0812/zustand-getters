import { memo } from 'react';
import { useIntermediateCartStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const CartTotalDisplay = memo(function CartTotalDisplay() {
  const total = useIntermediateCartStore((state) => state.total);
  const renderCount = useRenderCount();

  return (
    <div
      style={{
        border: '2px solid #ff9800',
        padding: '0.5em',
        margin: '0.25em 0',
        fontSize: '1.3em',
      }}
    >
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Total renders: {renderCount}
      </div>
      <div>
        Total: <strong style={{ color: '#ff9800' }}>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
});

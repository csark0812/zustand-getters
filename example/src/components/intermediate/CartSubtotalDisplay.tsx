import { memo } from 'react';
import { useIntermediateCartStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const CartSubtotalDisplay = memo(function CartSubtotalDisplay() {
  const subtotal = useIntermediateCartStore((state) => state.subtotal);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #ff9800', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Subtotal renders: {renderCount}
      </div>
      <div>
        Subtotal: <strong>${subtotal.toFixed(2)}</strong>
      </div>
    </div>
  );
});

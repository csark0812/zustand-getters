import { memo } from 'react';
import { useIntermediateCartStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const CartDiscountDisplay = memo(function CartDiscountDisplay() {
  const discount = useIntermediateCartStore((state) => state.discount);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #4caf50', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Discount renders: {renderCount}
      </div>
      <div>
        Discount: <strong style={{ color: '#4caf50' }}>-${discount.toFixed(2)}</strong>
      </div>
    </div>
  );
});

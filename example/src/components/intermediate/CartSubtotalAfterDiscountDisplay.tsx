import { memo } from 'react';
import { useIntermediateCartStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const CartSubtotalAfterDiscountDisplay = memo(function CartSubtotalAfterDiscountDisplay() {
  const subtotalAfterDiscount = useIntermediateCartStore((state) => state.subtotalAfterDiscount);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #ff9800', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 SubtotalAfterDiscount renders: {renderCount}
      </div>
      <div>
        After Discount: <strong>${subtotalAfterDiscount.toFixed(2)}</strong>
      </div>
    </div>
  );
});

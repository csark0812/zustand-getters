import { memo } from 'react';
import { useIntermediateCartStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const CartItemCountDisplay = memo(function CartItemCountDisplay() {
  const itemCount = useIntermediateCartStore((state) => state.itemCount);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #ff9800', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 ItemCount renders: {renderCount}
      </div>
      <div>
        Items: <strong>{itemCount}</strong>
      </div>
    </div>
  );
});

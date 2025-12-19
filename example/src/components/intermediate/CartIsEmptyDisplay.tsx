import { memo } from 'react';
import { useIntermediateCartStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const CartIsEmptyDisplay = memo(function CartIsEmptyDisplay() {
  const isEmpty = useIntermediateCartStore((state) => state.isEmpty);
  const renderCount = useRenderCount();

  if (isEmpty) {
    return (
      <div style={{ border: '1px solid #888', padding: '0.5em', margin: '0.25em 0' }}>
        <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
          🔄 IsEmpty renders: {renderCount}
        </div>
        <div style={{ fontSize: '1.2em', color: '#888' }}>Cart is empty</div>
      </div>
    );
  }

  return null;
});

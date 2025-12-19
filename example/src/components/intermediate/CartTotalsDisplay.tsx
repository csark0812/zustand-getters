import { memo } from 'react';
import { CartItemCountDisplay } from './CartItemCountDisplay';
import { CartSubtotalDisplay } from './CartSubtotalDisplay';
import { CartDiscountDisplay } from './CartDiscountDisplay';
import { CartSubtotalAfterDiscountDisplay } from './CartSubtotalAfterDiscountDisplay';
import { CartTaxDisplay } from './CartTaxDisplay';
import { CartTotalDisplay } from './CartTotalDisplay';
import { CartIsEmptyDisplay } from './CartIsEmptyDisplay';

export const CartTotalsDisplay = memo(function CartTotalsDisplay() {
  return (
    <div style={{ border: '2px solid #ff9800', padding: '1em', margin: '1em 0' }}>
      <div style={{ fontSize: '0.85em', marginTop: '0.5em', color: '#888', marginBottom: '0.5em' }}>
        ✅ Each component subscribes to a single computed getter
      </div>
      <CartIsEmptyDisplay />
      <div>
        <CartItemCountDisplay />
        <CartSubtotalDisplay />
        <CartDiscountDisplay />
        <CartSubtotalAfterDiscountDisplay />
        <CartTaxDisplay />
        <CartTotalDisplay />
      </div>
    </div>
  );
});

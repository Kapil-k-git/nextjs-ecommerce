
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apolloClient } from '@/lib/apollo-client';
import {
  CHECKOUT_CREATE,
  CHECKOUT_LINES_ADD,
  CHECKOUT_LINES_UPDATE,
  CHECKOUT_LINE_DELETE,
} from '@/lib/graphql/mutations';
import { GET_CHECKOUT } from '@/lib/graphql/queries';
import { CartState, CartItem } from '@/lib/types';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      checkoutId: null,
      items: [],
      itemCount: 0,
      totalAmount: 0,

      addItem: async (variantId: string, quantity = 1) => {
        try {
          const state = get();
          let checkoutId = state.checkoutId;

          // Create checkout if it doesn't exist
          if (!checkoutId) {
            const { data: createData } = await apolloClient.mutate({
              mutation: CHECKOUT_CREATE,
              variables: {
                input: {
                  channel: 'online-inr',
                  lines: [{ quantity, variantId }],
                  email: 'user@example.com',
                },
              },
            });

            if (createData.checkoutCreate.errors.length > 0) {
              console.error('Checkout create errors:', createData.checkoutCreate.errors);
              return;
            }

            checkoutId = createData.checkoutCreate.checkout.id;
            set({ 
              checkoutId,
              items: createData.checkoutCreate.checkout.lines,
            });
          } else {
            // Add to existing checkout
            const { data: addData } = await apolloClient.mutate({
              mutation: CHECKOUT_LINES_ADD,
              variables: {
                checkoutId,
                lines: [{ quantity, variantId }],
              },
            });

            if (addData.checkoutLinesAdd.errors.length > 0) {
              console.error('Add to cart errors:', addData.checkoutLinesAdd.errors);
              return;
            }

            set({ items: addData.checkoutLinesAdd.checkout.lines });
          }

          // Update computed values
          const newState = get();
          const itemCount = newState.items.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = newState.items.reduce(
            (sum, item) => sum + (item.variant.pricing?.price.gross.amount || 0) * item.quantity,
            0
          );

          set({ itemCount, totalAmount });
        } catch (error) {
          console.error('Add item error:', error);
        }
      },

      updateItem: async (lineId: string, quantity: number) => {
        try {
          const { checkoutId } = get();
          if (!checkoutId) return;

          const { data } = await apolloClient.mutate({
            mutation: CHECKOUT_LINES_UPDATE,
            variables: {
              checkoutId,
              lines: [{ id: lineId, quantity }],
            },
          });

          if (data.checkoutLinesUpdate.errors.length > 0) {
            console.error('Update item errors:', data.checkoutLinesUpdate.errors);
            return;
          }

          await get().loadCheckout();
        } catch (error) {
          console.error('Update item error:', error);
        }
      },

      removeItem: async (lineId: string) => {
        try {
          const { checkoutId } = get();
          if (!checkoutId) return;

          const { data } = await apolloClient.mutate({
            mutation: CHECKOUT_LINE_DELETE,
            variables: {
              checkoutId,
              lineId,
            },
          });

          if (data.checkoutLineDelete.errors.length > 0) {
            console.error('Remove item errors:', data.checkoutLineDelete.errors);
            return;
          }

          await get().loadCheckout();
        } catch (error) {
          console.error('Remove item error:', error);
        }
      },

      clearCart: () => {
        set({
          checkoutId: null,
          items: [],
          itemCount: 0,
          totalAmount: 0,
        });
      },

      loadCheckout: async () => {
        try {
          const { checkoutId } = get();
          if (!checkoutId) return;

          const { data } = await apolloClient.query({
            query: GET_CHECKOUT,
            variables: { id: checkoutId },
            fetchPolicy: 'network-only',
          });

          if (data.checkout) {
            const items = data.checkout.lines;
            const itemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
            const totalAmount = items.reduce(
              (sum: number, item: CartItem) => sum + (item.variant.pricing?.price.gross.amount || 0) * item.quantity,
              0
            );

            set({ items, itemCount, totalAmount });
          }
        } catch (error) {
          console.error('Load checkout error:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        checkoutId: state.checkoutId,
      }),
    }
  )
);

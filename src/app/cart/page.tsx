'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/lib/types';

export default function CartPage(): JSX.Element {
  const {
    items,
    itemCount,
    totalAmount,
    updateItem,
    removeItem,
    loadCheckout,
  }: {
    items: CartItem[];
    itemCount: number;
    totalAmount: number;
    updateItem: (id: string, quantity: number) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    loadCheckout: () => void;
  } = useCartStore();

  useEffect(() => {
    loadCheckout();
  }, [loadCheckout]);

  const handleQuantityChange = async (item: CartItem, newQuantity: number): Promise<void> => {
    if (newQuantity <= 0) {
      await removeItem(item.id);
    } else {
      await updateItem(item.id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Shopping Cart ({itemCount} items)
      </h1>

      <div className="bg-white rounded-lg shadow-sm border">
        {items.map((item: CartItem) => (
          <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-4">
              {/* Product Image */}
              <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.variant.product.thumbnail?.url ? (
                  <img
                    src={item.variant.product.thumbnail.url}
                    alt={item.variant.product.name}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.variant.product.slug}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {item.variant.product.name}
                </Link>
                <p className="text-gray-600">{item.variant.name}</p>
                {item.variant.pricing?.price.gross && (
                  <p className="text-lg font-semibold text-gray-900">
                    {item.variant.pricing.price.gross.currency}{' '}
                    {item.variant.pricing.price.gross.amount.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right min-w-0">
                {item.variant.pricing?.price.gross && (
                  <p className="text-lg font-semibold text-gray-900">
                    {item.variant.pricing.price.gross.currency}{' '}
                    {(item.variant.pricing.price.gross.amount * item.quantity).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800 transition-colors p-1"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-gray-900">
            INR {totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="btn-secondary flex-1 text-center">
            Continue Shopping
          </Link>
          <Link href="/checkout" className="btn-primary flex-1 text-center">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

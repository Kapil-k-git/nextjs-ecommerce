
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.defaultVariant?.id) {
      await addItem(product.defaultVariant.id);
    }
  };

  const price = product?.defaultVariant?.pricing?.price?.gross;

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square">
          {product?.media?.[0]?.url ? (
            <img
              src={product?.media[0]?.url}
              alt={product?.media[0]?.url || product.name}
              // fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        )}

        <div className="flex items-center justify-between">
          {price && (
            <span className="text-xl font-bold text-gray-900">
              {price.currency} {price.amount.toLocaleString()}
            </span>
          )}

          {(product.isAvailableForPurchase || product.defaultVariant?.id) && (
            <button
              onClick={handleAddToCart}
              className="btn-primary text-sm px-3 py-1"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

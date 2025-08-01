
'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_PRODUCT } from '@/lib/graphql/queries';
import { Product, ProductVariant } from '@/lib/types';
import { useCartStore } from '@/store/cart-store';
import { ProductDetailSkeleton } from '@/components/ui/loading-skeleton';
import EditorJsRenderer from '@/components/products/EditorJsRenderer';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      slug,
      channel: 'online-inr',
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all', // This will return data even with cursor errors
    fetchPolicy: 'cache-and-network', // Better for handling cursor issues
    onError: (error) => {
      // Handle cursor errors specifically
      if (error.message.includes('cursor') && error.message.includes('does not exist')) {
        console.warn('Cursor error detected, but data should still be available');
        // Don't show error UI for cursor errors since data is usually still valid
        return;
      }
      console.error("GraphQL Error:", error.message);
    }
  });

  console.log()
  const product: Product | null = data?.product;

  React.useEffect(() => {
    if (product && !selectedVariant) {
      setSelectedVariant(product.defaultVariant || product.variants?.[0] || null);
    }
  }, [product, selectedVariant]);

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id;
    if (variantId) {
      await addItem(variantId, quantity);
    }
  };

  if (loading) return <ProductDetailSkeleton />;

  const images = product?.media?.filter(media => media.type === 'IMAGE') || [];
  const currentVariant = selectedVariant || product?.defaultVariant;
  const price = currentVariant?.pricing?.price?.gross;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {images.length > 0 && images[selectedImageIndex] ? (
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].alt || product?.name}
                // fill
                className="object-cover"
                // priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image?.alt || product?.name}
                    // fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
            {product?.category && (
              <p className="text-lg text-gray-600">{product.category.name}</p>
            )}
          </div>

          {price && (
            <div className="text-3xl font-bold text-gray-900">
              {price.currency} {price.amount.toLocaleString()}
            </div>
          )}

          {product?.description && (
            <div className="prose prose-sm">
              <EditorJsRenderer data={product?.description} />
            </div>
          )}

          Variants
          {product?.variants && product.variants.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Options</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`text-left p-3 border rounded-lg ${
                      selectedVariant?.id === variant.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{variant.name}</span>
                      {variant.pricing?.price?.gross && (
                        <span className="font-semibold">
                          {variant.pricing.price.gross.currency} {variant.pricing.price.gross.amount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          {product?.isAvailableForPurchase && currentVariant && (
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary py-3 text-lg"
            >
              Add to Cart
            </button>
          )}

          {/* Product Attributes */}
          {product?.attributes && product.attributes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="space-y-2">
                {product.attributes.map((attr) => (
                  <div key={attr.attribute.id} className="flex justify-between">
                    <span className="text-gray-600">{attr.attribute.name}:</span>
                    <span className="font-medium">
                      {attr.values.map(value => value.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-lg text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Details</h2>
        <p className="text-gray-600">Order Number: <span className="font-semibold">#{orderNumber}</span></p>
        <p className="text-sm text-gray-500 mt-2">
          You will receive an email confirmation shortly with your order details and tracking information.
        </p>
      </div>

      <div className="space-y-4">
        <Link href="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

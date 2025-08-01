
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import {
  CHECKOUT_SHIPPING_ADDRESS_UPDATE,
  CHECKOUT_BILLING_ADDRESS_UPDATE,
  CHECKOUT_PAYMENT_CREATE,
  CHECKOUT_COMPLETE,
} from '@/lib/graphql/mutations';
import { GET_CHECKOUT } from '@/lib/graphql/queries';
import { Address } from '@/lib/types';

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  city: string;
  countryArea: string;
  postalCode: string;
  country: string;
  sameAsBilling: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingStreetAddress1: string;
  billingCity: string;
  billingCountryArea: string;
  billingPostalCode: string;
  billingCountry: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutId, items, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      country: 'IN',
      billingCountry: 'IN',
      sameAsBilling: true,
    },
  });

  const sameAsBilling = watch('sameAsBilling');

  // Get checkout details
  const { data: checkoutData } = useQuery(GET_CHECKOUT, {
    variables: { id: checkoutId },
    skip: !checkoutId,
  });

  const [updateShippingAddress] = useMutation(CHECKOUT_SHIPPING_ADDRESS_UPDATE);
  const [updateBillingAddress] = useMutation(CHECKOUT_BILLING_ADDRESS_UPDATE);
  const [createPayment] = useMutation(CHECKOUT_PAYMENT_CREATE);
  const [completeCheckout] = useMutation(CHECKOUT_COMPLETE);

  useEffect(() => {
    if (!checkoutId || items.length === 0) {
      router.push('/cart');
    }
  }, [checkoutId, items, router]);

  const onSubmit = async (data: CheckoutForm) => {
    if (!checkoutId) return;

    setIsProcessing(true);

    try {
      // Update shipping address
      const shippingAddress: Address = {
        firstName: data.firstName,
        lastName: data.lastName,
        streetAddress1: data.streetAddress1,
        city: data.city,
        countryArea: data.countryArea,
        postalCode: data.postalCode,
        country: { code: data.country },
      };

      await updateShippingAddress({
        variables: {
          checkoutId,
          shippingAddress,
        },
      });

      // Update billing address
      const billingAddress: Address = sameAsBilling
        ? shippingAddress
        : {
            firstName: data.billingFirstName,
            lastName: data.billingLastName,
            streetAddress1: data.billingStreetAddress1,
            city: data.billingCity,
            countryArea: data.billingCountryArea,
            postalCode: data.billingPostalCode,
            country: { code: data.billingCountry },
          };

      await updateBillingAddress({
        variables: {
          checkoutId,
          billingAddress,
        },
      });

      // Create dummy payment
      const totalAmount = checkoutData?.checkout?.totalPrice?.gross?.amount || 0;
      
      await createPayment({
        variables: {
          checkoutId,
          input: {
            gateway: 'mirumee.payments.dummy',
            token: 'dummy-token',
            amount: totalAmount,
          },
        },
      });

      // Complete checkout
      const { data: completeData } = await completeCheckout({
        variables: { checkoutId },
      });

      if (completeData.checkoutComplete.order) {
        clearCart();
        router.push(`/order-confirmation/${completeData.checkoutComplete.order.number}`);
      } else {
        console.error('Checkout completion errors:', completeData.checkoutComplete.errors);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutId || items.length === 0) {
    return null;
  }

  const checkout = checkoutData?.checkout;
  const total = checkout?.totalPrice?.gross;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            {!isAuthenticated && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    className="input-field"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    className="input-field"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    {...register('streetAddress1', { required: 'Address is required' })}
                    className="input-field"
                  />
                  {errors.streetAddress1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.streetAddress1.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    className="input-field"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    {...register('countryArea', { required: 'State is required' })}
                    className="input-field"
                  />
                  {errors.countryArea && (
                    <p className="mt-1 text-sm text-red-600">{errors.countryArea.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    {...register('postalCode', { required: 'Postal code is required' })}
                    className="input-field"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select {...register('country')} className="input-field">
                    <option value="IN">India</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <input
                  {...register('sameAsBilling')}
                  type="checkbox"
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Billing address same as shipping
                </label>
              </div>

              {!sameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billing form fields - similar to shipping */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register('billingFirstName', { 
                        required: !sameAsBilling ? 'First name is required' : false 
                      })}
                      className="input-field"
                    />
                  </div>
                  {/* Add other billing fields similarly */}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.variant.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  {item.variant.pricing?.price.gross && (
                    <span className="font-medium">
                      {item.variant.pricing.price.gross.currency}{' '}
                      {(item.variant.pricing.price.gross.amount * item.quantity).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {total && (
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{total.currency} {total.amount.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

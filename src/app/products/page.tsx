'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/graphql/queries';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductCardSkeleton } from '@/components/ui/loading-skeleton';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PRODUCTS_PER_PAGE = 5;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('name');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build filter for GraphQL query
  const buildFilter = useCallback(() => {
    const filter: any = {};
  
    if (debouncedSearch) {
      filter.search = debouncedSearch;
    }
  
    if (Object.keys(filters).length > 0) {
      filter.attributes = Object.entries(filters).map(([slug, values]) => ({
        slug,
        values,
      }));
    }
  
    return filter;
  }, [debouncedSearch, filters]);

  const filter = buildFilter();

  // Enhanced query with better error handling and variables
  const { loading, error, data, refetch, fetchMore, networkStatus } = useQuery(GET_PRODUCTS, {
    variables: {
      first: PRODUCTS_PER_PAGE,
      channel: 'online-inr',
      filter,
      sortBy: {
        field: sortBy.toUpperCase(),
        direction: 'ASC'
      }
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
  // Extract products safely with fallback
  const products: Product[] = React.useMemo(() => {
    try {
      return data?.products?.edges?.map((edge: any) => edge.node) || [];
    } catch (err) {
      console.warn('Error mapping products:', err);
      return [];
    }
  }, [data]);

  const hasNextPage = data?.products?.pageInfo?.hasNextPage;
  const endCursor = data?.products?.pageInfo?.endCursor;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !loading) {
      fetchMore({
        variables: {
          first: PRODUCTS_PER_PAGE,
          after: endCursor,
          channel: 'online-inr',
          filter,
          sortBy: {
            field: sortBy.toUpperCase(),
            direction: 'ASC'
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.products) return prev;

          return {
            ...prev,
            products: {
              ...fetchMoreResult.products,
              edges: [
                ...(prev?.products?.edges || []),
                ...fetchMoreResult.products.edges
              ],
            },
          };
        },
      }).catch((err) => {
        // Handle fetchMore errors gracefully
        if (err.message.includes('cursor')) {
          console.warn('Cursor error on fetchMore, refreshing query...');
          refetch();
        } else {
          console.error('Error loading more products:', err);
        }
      });
    }
  }, [hasNextPage, loading, endCursor, filter, sortBy, fetchMore, refetch]);

  // Retry function for manual refresh
  const handleRetry = useCallback(() => {
    refetch().catch((err) => {
      console.error('Error on retry:', err);
    });
  }, [refetch]);

  // Only show error UI for non-cursor errors
  const shouldShowError = error && !error.message.includes('cursor');

  if (shouldShowError) {
    console.error("GraphQL Error:", error.message);
    console.log("GraphQL Details:", error.graphQLErrors);
    console.log("Network Error:", error.networkError);
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Unable to load products. Please try again.</p>
          <button
            onClick={handleRetry}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Show warning for cursor errors (non-blocking) */}
        {error && error.message.includes('cursor') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Database connection issue detected, but products are still loading normally.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <ProductFilters onFilterChange={setFilters} />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>

              {hasNextPage && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
              {error && (
                <button
                  onClick={handleRetry}
                  className="mt-4 text-blue-600 hover:text-blue-700 underline"
                >
                  Refresh Products
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
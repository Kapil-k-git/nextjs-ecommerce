
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@apollo/client';
import { GET_ATTRIBUTES } from '@/lib/graphql/queries';
import { Attribute } from '@/lib/types';

interface ProductFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set());

  const { data, loading } = useQuery(GET_ATTRIBUTES, {
    variables: { first: 10 },
  });

  const attributes: Attribute[] = data?.attributes?.edges?.map((edge: any) => edge.node) || [];

  const handleFilterChange = (attributeSlug: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[attributeSlug]) {
        newFilters[attributeSlug] = [];
      }
      
      if (checked) {
        newFilters[attributeSlug] = [...newFilters[attributeSlug], value];
      } else {
        newFilters[attributeSlug] = newFilters[attributeSlug].filter(v => v !== value);
        if (newFilters[attributeSlug].length === 0) {
          delete newFilters[attributeSlug];
        }
      }
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const toggleFilterExpanded = (attributeSlug: string) => {
    setExpandedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(attributeSlug)) {
        newSet.delete(attributeSlug);
      } else {
        newSet.add(attributeSlug);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>
      
      {attributes.map(attribute => {
        const choices = attribute.choices?.edges?.map(edge => edge.node) || [];
        const isExpanded = expandedFilters.has(attribute.slug);
        
        if (choices.length === 0) return null;
        
        return (
          <div key={attribute.id} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleFilterExpanded(attribute.slug)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
            >
              {attribute.name}
              <ChevronDownIcon 
                className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            
            {isExpanded && (
              <div className="space-y-2">
                {choices.map(choice => (
                  <label key={choice.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters[attribute.slug]?.includes(choice.slug) || false}
                      onChange={(e) => handleFilterChange(attribute.slug, choice.slug, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{choice.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

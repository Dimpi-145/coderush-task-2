import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function ItemShowcase({ item }) {
  const [activeTab, setActiveTab] = useState('specs');
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
      {/* Item Image */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-950 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        <div className="absolute top-3 right-3">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1.5 rounded-md bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition shadow-sm border border-gray-200 dark:border-gray-700"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            aria-label="Toggle image zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Content */}
      <div className="p-6">
        <div className="mb-4">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
            Lot {item.lotNumber}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {item.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {item.subtitle}
          </p>
        </div>

        {/* Price & Estimate Grid */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 mb-6">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Starting Price
            </span>
            <span className="text-base font-semibold font-mono-num text-gray-900 dark:text-gray-100">
              {formatCurrency(item.startingPrice)}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Estimate
            </span>
            <span className="text-base font-semibold font-mono-num text-gray-900 dark:text-gray-100">
              {formatCurrency(item.estimateLow)} – {formatCurrency(item.estimateHigh)}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Min Increment
            </span>
            <span className="text-base font-semibold font-mono-num text-blue-600 dark:text-blue-400">
              +{formatCurrency(100)}
            </span>
          </div>
        </div>

        {/* Tabs for Specs / Details */}
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-xs font-medium pb-1 transition border-b-2 -mb-[9px] ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            className={`text-xs font-medium pb-1 transition border-b-2 -mb-[9px] ${
              activeTab === 'provenance'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Provenance
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'specs' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {item.specifications.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between p-2.5 rounded-md bg-gray-50 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-800"
              >
                <span className="text-gray-500 dark:text-gray-400">{spec.label}</span>
                <span className="text-gray-900 dark:text-gray-200 font-medium font-mono text-right ml-2">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3.5 rounded-md bg-gray-50 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
            <p>{item.description}</p>
            <p className="text-gray-500 dark:text-gray-400">{item.provenance}</p>
          </div>
        )}
      </div>
    </div>
  );
}

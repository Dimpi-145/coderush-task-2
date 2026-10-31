import React, { useState } from 'react';
import { Plus, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { formatCurrency, calculateTimeRemaining } from '../utils/formatters';

export function ProductList({
  products,
  selectedProductId,
  onSelectProduct,
  onOpenAddProduct,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'upcoming' | 'ended'

  const filteredProducts = products.filter((p) => {
    const now = Date.now();
    const isEnded = p.status === 'ended' || now >= p.endTime;
    const isUpcoming = p.status === 'upcoming' || now < p.startTime;
    const isActive = !isEnded && !isUpcoming;

    if (filter === 'active') return isActive;
    if (filter === 'upcoming') return isUpcoming;
    if (filter === 'ended') return isEnded;
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Auction Products & Schedule
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono">
            {products.length} {products.length === 1 ? 'lot' : 'lots'}
          </span>
        </div>

        {/* Action + Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Tabs */}
          <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded-md transition ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs'
                  : 'hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-2 py-1 rounded-md transition ${
                filter === 'active'
                  ? 'bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-2 py-1 rounded-md transition ${
                filter === 'upcoming'
                  ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('ended')}
              className={`px-2 py-1 rounded-md transition ${
                filter === 'ended'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs'
                  : 'hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Sold
            </button>
          </div>

          {/* Add Product Button */}
          <button
            onClick={onOpenAddProduct}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProducts.map((product) => {
          const isSelected = product.id === selectedProductId;
          const now = Date.now();
          const isEnded = product.status === 'ended' || now >= product.endTime;
          const isUpcoming = product.status === 'upcoming' || now < product.startTime;
          const topBid =
            product.bids && product.bids.length > 0
              ? product.bids[0].amount
              : product.startingPrice;

          const targetTime = isUpcoming ? product.startTime : product.endTime;
          const remaining = calculateTimeRemaining(targetTime);

          return (
            <button
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              className={`text-left p-3 rounded-lg border transition flex items-center gap-3 group cursor-pointer ${
                isSelected
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm ring-1 ring-blue-500/20'
                  : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {/* Product Thumbnail */}
              <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase">
                    Lot {product.lotNumber}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      isEnded
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        : isUpcoming
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                        : remaining.isUrgent
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {isEnded
                      ? 'Sold'
                      : isUpcoming
                      ? `Starts in ${remaining.minutes}m`
                      : remaining.isUrgent
                      ? `${remaining.minutes}:${remaining.seconds}`
                      : 'Live'}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {product.title}
                </h3>

                <div className="flex items-baseline justify-between mt-1 text-xs">
                  <span className="font-mono-num font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(topBid)}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {product.bids?.length || 0} bids
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

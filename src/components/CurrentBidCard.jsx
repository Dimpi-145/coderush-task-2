import React, { useEffect, useState } from 'react';
import { formatCurrency, formatRelativeTime, getInitials, getAvatarColor } from '../utils/formatters';

export function CurrentBidCard({
  highestBid,
  highestBidder,
  startingPrice,
  hasBids,
  totalBids,
  status,
  winner,
}) {
  const [pulse, setPulse] = useState(false);
  const isEnded = status === 'ended';

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [highestBid]);

  return (
    <div
      className={`rounded-xl p-5 bg-white dark:bg-gray-900 border transition-all ${
        pulse
          ? 'border-blue-400 dark:border-blue-500 shadow-sm'
          : 'border-gray-200 dark:border-gray-800'
      }`}
    >
      {/* Top Label & Status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase font-medium tracking-wider text-gray-500 dark:text-gray-400">
          {isEnded ? 'Final Hammer Price' : 'Current Highest Bid'}
        </span>

        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
          {totalBids} {totalBids === 1 ? 'bid' : 'bids'}
        </span>
      </div>

      {/* Main Numerical Value */}
      <div className="flex items-baseline justify-between gap-2 mb-4">
        <div
          className={`font-mono-num font-bold text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 transition-colors ${
            pulse ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          {formatCurrency(highestBid)}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          Starting: {formatCurrency(startingPrice)}
        </div>
      </div>

      {/* Leading Bidder Row */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 text-xs">
        {hasBids && highestBidder ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-md ${getAvatarColor(
                highestBidder.bidderName
              )} font-medium text-xs flex items-center justify-center shrink-0`}
            >
              {getInitials(highestBidder.bidderName)}
            </div>

            <div className="min-w-0 truncate">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {highestBidder.bidderName}
              </span>
              <span className="text-gray-400 dark:text-gray-500 ml-2">
                {formatRelativeTime(highestBidder.timestamp)}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">
            No bids placed yet
          </span>
        )}

        {hasBids && (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shrink-0">
            {isEnded ? 'Winner' : 'Leader'}
          </span>
        )}
      </div>
    </div>
  );
}

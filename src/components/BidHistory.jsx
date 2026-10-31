import React from 'react';
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
  getInitials,
  getAvatarColor,
} from '../utils/formatters';

export function BidHistory({ bids, savedBidderName, status, winner }) {
  const isEnded = status === 'ended';

  return (
    <div className="rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Bid History
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
        </span>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[340px] space-y-2 pr-1">
        {bids.length > 0 ? (
          bids.map((bid, index) => {
            const isHighest = index === 0;
            const isUser =
              savedBidderName &&
              bid.bidderName.trim().toLowerCase() === savedBidderName.trim().toLowerCase();

            return (
              <div
                key={bid.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition ${
                  isHighest
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                    : 'bg-gray-50/60 dark:bg-gray-800/40 border-gray-200/80 dark:border-gray-800'
                }`}
              >
                {/* Left: Rank, Avatar, Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-gray-400 dark:text-gray-500 font-mono text-[11px] w-4 shrink-0 text-center">
                    #{index + 1}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-md ${getAvatarColor(
                      bid.bidderName
                    )} font-medium text-xs flex items-center justify-center shrink-0`}
                  >
                    {getInitials(bid.bidderName)}
                  </div>

                  <div className="min-w-0 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {bid.bidderName}
                      </span>
                      {isUser && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          You
                        </span>
                      )}
                    </div>
                    <span
                      className="text-gray-400 dark:text-gray-500 text-[11px]"
                      title={formatDateTime(bid.timestamp)}
                    >
                      {formatRelativeTime(bid.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Right: Amount & Status */}
                <div className="text-right shrink-0">
                  <div
                    className={`font-mono-num font-semibold text-sm ${
                      isHighest
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {formatCurrency(bid.amount)}
                  </div>
                  <div>
                    {isHighest ? (
                      <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                        {isEnded ? 'Winner' : 'Highest'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        Outbid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-500">
            No bids recorded yet
          </div>
        )}
      </div>
    </div>
  );
}

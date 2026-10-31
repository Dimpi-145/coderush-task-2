import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Trophy, RotateCcw } from 'lucide-react';
import {
  formatCurrency,
  formatDateTime,
  getInitials,
  getAvatarColor,
} from '../utils/formatters';

export function WinnerModal({
  isOpen,
  onClose,
  winner,
  item,
  onReset,
  onPlayFanfare,
}) {
  useEffect(() => {
    if (isOpen && winner) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#3b82f6', '#93c5fd', '#64748b'],
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }
      onPlayFanfare?.();
    }
  }, [isOpen, winner, onPlayFanfare]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-center shadow-xl transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto w-12 h-12 mb-3 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center justify-center">
          <Trophy className="w-6 h-6" />
        </div>

        {winner ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Auction Ended
            </span>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">
              Winner Declared
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              The timed auction for Lot {item.lotNumber} has concluded.
            </p>

            {/* Winner Info Card */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 text-left mb-5">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div
                  className={`w-10 h-10 rounded-lg ${getAvatarColor(
                    winner.bidderName
                  )} font-semibold text-sm flex items-center justify-center shrink-0`}
                >
                  {getInitials(winner.bidderName)}
                </div>
                <div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 block">
                    Winning Bidder
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {winner.bidderName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 dark:text-gray-500 block">Winning Bid</span>
                  <span className="text-lg font-bold font-mono-num text-blue-600 dark:text-blue-400">
                    {formatCurrency(winner.amount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 dark:text-gray-500 block">Time</span>
                  <span className="text-gray-700 dark:text-gray-300 font-mono text-[11px]">
                    {formatDateTime(winner.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onReset?.();
                  onClose();
                }}
                className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Auction Ended
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              The auction ended with no bids placed above the starting price of{' '}
              {formatCurrency(item.startingPrice)}.
            </p>
            <button
              onClick={() => {
                onReset?.();
                onClose();
              }}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition"
            >
              Restart Auction
            </button>
          </>
        )}
      </div>
    </div>
  );
}

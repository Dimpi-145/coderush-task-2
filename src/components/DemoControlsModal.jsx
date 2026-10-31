import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export function DemoControlsModal({
  isOpen,
  onClose,
  onResetAuction,
  onEndNow,
  onSimulateBid,
  status,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Demo & Evaluation Controls
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Quick Timer Triggers */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Set Countdown Duration
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  onResetAuction(0.5, true); // 30 seconds
                  onClose();
                }}
                className="py-1.5 px-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium transition text-center"
              >
                30s
              </button>
              <button
                onClick={() => {
                  onResetAuction(2, true); // 2 minutes
                  onClose();
                }}
                className="py-1.5 px-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium transition text-center"
              >
                2m
              </button>
              <button
                onClick={() => {
                  onResetAuction(10, true); // 10 minutes
                  onClose();
                }}
                className="py-1.5 px-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium transition text-center"
              >
                10m
              </button>
            </div>
          </div>

          {/* Instant Simulation Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <button
              onClick={() => {
                onEndNow();
                onClose();
              }}
              disabled={status === 'ended'}
              className="w-full py-2 px-3 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              End Auction Now
            </button>

            <button
              onClick={() => {
                onSimulateBid();
                onClose();
              }}
              disabled={status === 'ended'}
              className="w-full py-2 px-3 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Simulate Competing Bid
            </button>
          </div>

          {/* Reset Options */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Reset State
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onResetAuction(10, false);
                  onClose();
                }}
                className="py-1.5 px-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition text-center"
              >
                Reset (0 Bids)
              </button>
              <button
                onClick={() => {
                  onResetAuction(10, true);
                  onClose();
                }}
                className="py-1.5 px-2 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition text-center"
              >
                Reset (With Bids)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

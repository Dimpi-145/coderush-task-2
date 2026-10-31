import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { DEMO_BIDDERS } from '../data/auctionItem';
import { Clock, Play } from 'lucide-react';

export function BidForm({
  highestBid,
  startingPrice,
  hasBids,
  minRequiredBid,
  status,
  phase = 'active',
  startTime,
  winner,
  savedBidderName,
  onPlaceBid,
  onStartNow,
  onPlaySuccess,
  onPlayReject,
  onToast,
}) {
  const [bidderName, setBidderName] = useState(savedBidderName || '');
  const [bidAmount, setBidAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const isUpcoming = phase === 'upcoming' || status === 'upcoming';
  const isEnded = phase === 'ended' || status === 'ended';
  const effectiveCurrentBid = hasBids ? highestBid : startingPrice;
  const minimumAllowedBid = effectiveCurrentBid + 100;

  useEffect(() => {
    if (savedBidderName && !bidderName) {
      setBidderName(savedBidderName);
    }
  }, [savedBidderName]);

  // Update minimum bid amount automatically whenever current highest bid updates
  useEffect(() => {
    const nextMin = effectiveCurrentBid + 100;
    if (!bidAmount || Number(bidAmount) < nextMin) {
      setBidAmount(String(nextMin));
    }
  }, [effectiveCurrentBid]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleQuickIncrement = (increment) => {
    if (isEnded || isUpcoming) return;
    const base = hasBids ? highestBid : startingPrice;
    const nextAmount = base + increment;
    setBidAmount(String(nextAmount));
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isUpcoming) {
      setErrorMsg('Bidding has not started yet. Please wait for the scheduled time slot.');
      onPlayReject?.();
      triggerShake();
      return;
    }

    if (isEnded) {
      setErrorMsg('This auction has concluded. Bids are no longer accepted.');
      onPlayReject?.();
      triggerShake();
      return;
    }

    const trimmedName = bidderName.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter your name to place a bid.');
      onPlayReject?.();
      triggerShake();
      return;
    }

    const numericAmount = parseFloat(bidAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid numeric bid amount.');
      onPlayReject?.();
      triggerShake();
      return;
    }

    // Strict validation: Every new bid must be at least ₹100 higher than current highest bid
    if (numericAmount < minimumAllowedBid) {
      setErrorMsg(
        `Bid rejected: Your bid of ${formatCurrency(
          numericAmount
        )} must be at least ₹100 higher than the current highest bid of ${formatCurrency(
          effectiveCurrentBid
        )}. Minimum required bid is ${formatCurrency(minimumAllowedBid)}.`
      );
      onPlayReject?.();
      triggerShake();
      onToast?.({
        type: 'error',
        title: 'Bid Rejected',
        message: `Must be at least ₹100 higher (Min: ${formatCurrency(minimumAllowedBid)})`,
      });
      return;
    }

    // Dispatch bid
    const result = onPlaceBid(trimmedName, numericAmount);

    if (result.success) {
      setSuccessMsg(result.message);
      onPlaySuccess?.();
      onToast?.({
        type: 'success',
        title: 'Bid Placed',
        message: `${formatCurrency(numericAmount)} by ${trimmedName}`,
      });
      // Automatically update the minimum bid amount for the next bid (+₹100)
      setBidAmount(String(numericAmount + 100));
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(result.message);
      onPlayReject?.();
      triggerShake();
      onToast?.({
        type: 'error',
        title: 'Bid Failed',
        message: result.message,
      });
    }
  };

  return (
    <div
      className={`rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors ${
        isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {isUpcoming
            ? 'Bidding Scheduled'
            : isEnded
            ? 'Bidding Closed'
            : 'Place Bid'}
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {isUpcoming
            ? `Base: ${formatCurrency(startingPrice)}`
            : `Min next bid: ${formatCurrency(minimumAllowedBid)}`}
        </span>
      </div>

      {isUpcoming ? (
        <div className="p-4 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Bidding Opens Soon
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This lot is scheduled to open for live bidding at{' '}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatDateTime(startTime)}
              </span>
              .
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
              Base Starting Price: {formatCurrency(startingPrice)}
            </p>
          </div>

          {onStartNow && (
            <button
              onClick={onStartNow}
              className="mt-2 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition inline-flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Launch Bidding Now</span>
            </button>
          )}
        </div>
      ) : isEnded ? (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 text-center space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Auction Has Ended
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The allocated bidding time slot has closed.
          </p>
          {winner && (
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 pt-1">
              Sold to {winner.bidderName} for {formatCurrency(winner.amount)}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Participant Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Participant Name
            </label>
            <input
              type="text"
              value={bidderName}
              onChange={(e) => {
                setBidderName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Enter your name"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 transition"
              required
            />

            {/* Quick Demo Names */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-gray-400 dark:text-gray-500">Quick fill:</span>
              {DEMO_BIDDERS.slice(0, 3).map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => {
                    setBidderName(name);
                    setErrorMsg('');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Bid Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Bid Amount (INR)
              </label>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                At least ₹100 higher than {formatCurrency(effectiveCurrentBid)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 font-mono text-sm">
                ₹
              </span>
              <input
                type="number"
                step="50"
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={String(minimumAllowedBid)}
                className="w-full pl-7 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 font-mono text-base font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 transition"
                required
              />
            </div>

            {/* Quick Increment Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {[100, 250, 500, 1000].map((inc) => (
                <button
                  type="button"
                  key={inc}
                  onClick={() => handleQuickIncrement(inc)}
                  className="py-1 px-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-xs font-mono font-medium text-gray-700 dark:text-gray-300 transition text-center"
                >
                  +₹{inc}
                </button>
              ))}
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
          >
            Place Bid
          </button>
        </form>
      )}
    </div>
  );
}

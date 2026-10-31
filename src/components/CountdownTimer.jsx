import React from 'react';
import { formatDateTime } from '../utils/formatters';
import { Play } from 'lucide-react';

export function CountdownTimer({
  timeRemaining,
  startTime,
  endTime,
  status,
  phase = 'active',
  onStartNow,
}) {
  const { days, hours, minutes, seconds, isExpired, isUrgent } = timeRemaining;
  const isUpcoming = phase === 'upcoming' || status === 'upcoming';
  const isEnded = phase === 'ended' || status === 'ended';

  const timeUnits = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];

  return (
    <div
      className={`rounded-xl p-5 bg-white dark:bg-gray-900 border transition-colors ${
        isEnded
          ? 'border-gray-200 dark:border-gray-800'
          : isUpcoming
          ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20'
          : isUrgent
          ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20'
          : 'border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold tracking-wide uppercase ${
            isEnded
              ? 'text-gray-500 dark:text-gray-400'
              : isUpcoming
              ? 'text-blue-600 dark:text-blue-400'
              : isUrgent
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {isEnded
            ? 'Auction Concluded'
            : isUpcoming
            ? 'Bidding Starts In'
            : 'Live Bidding — Time Remaining'}
        </span>

        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          {isUpcoming
            ? `Opens: ${formatDateTime(startTime)}`
            : `Closes: ${formatDateTime(endTime)}`}
        </span>
      </div>

      {/* Timer Grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-center transition ${
              isEnded
                ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-400'
                : isUpcoming
                ? 'bg-white dark:bg-gray-800/80 border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300'
                : isUrgent
                ? 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300'
                : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100'
            }`}
          >
            <span className="font-mono-num font-semibold text-2xl tracking-tight leading-tight">
              {unit.value}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Upcoming Quick Action for Admin */}
      {isUpcoming && onStartNow && (
        <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            Scheduled time slot is locked
          </span>
          <button
            onClick={onStartNow}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Launch Bidding Now</span>
          </button>
        </div>
      )}
    </div>
  );
}

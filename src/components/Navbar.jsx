import React from 'react';
import { Volume2, VolumeX, Sliders, Sun, Moon, Trophy, Plus } from 'lucide-react';

export function Navbar({
  status,
  phase = 'active',
  timeRemaining,
  soundEnabled,
  onToggleSound,
  onOpenControls,
  onOpenAddProduct,
  winner,
  onOpenWinner,
  theme,
  onToggleTheme,
}) {
  const isUpcoming = phase === 'upcoming' || status === 'upcoming';
  const isUrgent = timeRemaining.isUrgent && phase === 'active';
  const isEnded = phase === 'ended' || status === 'ended';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-gray-900 dark:text-gray-100 tracking-tight">
                Timed Auction Platform
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Scheduled Bidding Slots & Live Winner Allocation
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Phase Badge */}
          {isEnded ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-700">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span>Ended</span>
              {winner && (
                <button
                  onClick={onOpenWinner}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trophy className="w-3 h-3" /> Winner
                </button>
              )}
            </div>
          ) : isUpcoming ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Upcoming</span>
            </div>
          ) : isUrgent ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Ending soon ({timeRemaining.minutes}:{timeRemaining.seconds})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Live Bidding</span>
            </div>
          )}

          {/* Add Product Button */}
          {onOpenAddProduct && (
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            aria-label="Toggle Sound"
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Demo Controls */}
          <button
            onClick={onOpenControls}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Controls</span>
          </button>
        </div>
      </div>
    </header>
  );
}

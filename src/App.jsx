import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { ItemShowcase } from './components/ItemShowcase';
import { CountdownTimer } from './components/CountdownTimer';
import { CurrentBidCard } from './components/CurrentBidCard';
import { BidForm } from './components/BidForm';
import { BidHistory } from './components/BidHistory';
import { WinnerModal } from './components/WinnerModal';
import { AddProductModal } from './components/AddProductModal';
import { DemoControlsModal } from './components/DemoControlsModal';
import { ToastContainer } from './components/Toast';
import { useAuction } from './hooks/useAuction';
import { useSound } from './hooks/useSound';
import { RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDateTime } from './utils/formatters';

const THEME_KEY = 'auction_app_theme';

export default function App() {
  const {
    products,
    selectedProductId,
    item,
    startingPrice,
    highestBid,
    highestBidder,
    hasBids,
    bids,
    totalBids,
    minRequiredBid,
    status,
    phase,
    winner,
    startTime,
    endTime,
    timeRemaining,
    savedBidderName,
    showWinnerModal,
    setShowWinnerModal,
    isAddProductOpen,
    setIsAddProductOpen,
    selectProduct,
    addProduct,
    startBiddingNow,
    placeBid,
    resetAuction,
    endAuctionNow,
    simulateCompetitorBid,
  } = useAuction();

  const {
    soundEnabled,
    toggleSound,
    playBidPlaced,
    playBidRejected,
    playAuctionWon,
  } = useSound();

  // Light / Dark Mode state management
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const isEnded = phase === 'ended' || status === 'ended';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        status={status}
        phase={phase}
        timeRemaining={timeRemaining}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenControls={() => setIsControlsOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        winner={winner}
        onOpenWinner={() => setShowWinnerModal(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Product Catalog / Lot Selector */}
        <ProductList
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={selectProduct}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
        />

        {/* Minimal Auction Ended Banner */}
        {isEnded && (
          <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-gray-900 dark:text-gray-100 transition">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Auction Concluded — Lot {item?.lotNumber}
                </span>
                {winner ? (
                  <p className="text-sm font-medium mt-0.5">
                    Sold to <span className="font-semibold">{winner.bidderName}</span> for{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(winner.amount)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Auction ended with no bids placed above base starting price of{' '}
                    {formatCurrency(startingPrice)}.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {winner && (
                  <button
                    onClick={() => setShowWinnerModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition"
                  >
                    View Winner
                  </button>
                )}
                <button
                  onClick={() => resetAuction(10, false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Auction</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Auction Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Item Showcase */}
          <div className="lg:col-span-7">
            {item && <ItemShowcase item={item} />}
          </div>

          {/* Right Column: Timer, Current Bid, Form, History */}
          <div className="lg:col-span-5 space-y-4">
            <CountdownTimer
              timeRemaining={timeRemaining}
              startTime={startTime}
              endTime={endTime}
              status={status}
              phase={phase}
              onStartNow={() => startBiddingNow(selectedProductId)}
            />

            <CurrentBidCard
              highestBid={highestBid}
              highestBidder={highestBidder}
              startingPrice={startingPrice}
              hasBids={hasBids}
              totalBids={totalBids}
              status={status}
              winner={winner}
            />

            <BidForm
              highestBid={highestBid}
              startingPrice={startingPrice}
              hasBids={hasBids}
              minRequiredBid={minRequiredBid}
              status={status}
              phase={phase}
              startTime={startTime}
              winner={winner}
              savedBidderName={savedBidderName}
              onPlaceBid={placeBid}
              onStartNow={() => startBiddingNow(selectedProductId)}
              onPlaySuccess={playBidPlaced}
              onPlayReject={playBidRejected}
              onToast={addToast}
            />

            <BidHistory
              bids={bids}
              savedBidderName={savedBidderName}
              status={status}
              winner={winner}
            />
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 text-xs text-gray-500 dark:text-gray-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span>Timed Auction Platform • Scheduled Bidding System</span>
          <button
            onClick={() => setIsControlsOpen(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Demo Settings
          </button>
        </div>
      </footer>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={addProduct}
        onToast={addToast}
      />

      {/* Winner Celebration Modal */}
      <WinnerModal
        isOpen={showWinnerModal}
        onClose={() => setShowWinnerModal(false)}
        winner={winner}
        item={item}
        onReset={() => resetAuction(10, false)}
        onPlayFanfare={playAuctionWon}
      />

      {/* Demo Controls Modal */}
      <DemoControlsModal
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        onResetAuction={resetAuction}
        onEndNow={endAuctionNow}
        onSimulateBid={simulateCompetitorBid}
        status={status}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

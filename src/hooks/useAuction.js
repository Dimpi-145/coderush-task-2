import { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/auctionItem';
import { calculateTimeRemaining, formatCurrency } from '../utils/formatters';

const PRODUCTS_STORAGE_KEY = 'aetheria_scheduled_auctions_v4';
const SELECTED_ID_KEY = 'aetheria_selected_product_id_v4';
const USER_NAME_KEY = 'aetheria_bidder_name';

export function useAuction() {
  // Load products list from localStorage or fallback to INITIAL_PRODUCTS
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved products list', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Selected product ID
  const [selectedProductId, setSelectedProductId] = useState(() => {
    try {
      const savedId = localStorage.getItem(SELECTED_ID_KEY);
      if (savedId && products.some((p) => p.id === savedId)) {
        return savedId;
      }
    } catch (e) {}
    return products[0]?.id || 'prod-1-daytona';
  });

  // Saved bidder name
  const [savedBidderName, setSavedBidderName] = useState(() => {
    try {
      return localStorage.getItem(USER_NAME_KEY) || '';
    } catch {
      return '';
    }
  });

  // Modal & notification controls
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Active product object
  const activeProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Determine active product phase & target countdown timestamp
  const activePhase = useMemo(() => {
    if (!activeProduct) return 'ended';
    const now = Date.now();
    if (activeProduct.status === 'ended' || now >= activeProduct.endTime) {
      return 'ended';
    }
    if (now < activeProduct.startTime) {
      return 'upcoming';
    }
    return 'active';
  }, [activeProduct]);

  // Target timestamp for active product countdown
  const targetTimestamp = useMemo(() => {
    if (!activeProduct) return Date.now();
    if (activePhase === 'upcoming') {
      return activeProduct.startTime;
    }
    return activeProduct.endTime;
  }, [activeProduct, activePhase]);

  // Real-time countdown for active product
  const [timeRemaining, setTimeRemaining] = useState(() =>
    calculateTimeRemaining(targetTimestamp)
  );

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.error('Failed to save products to localStorage', err);
    }
  }, [products]);

  // Persist selected product ID
  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_ID_KEY, selectedProductId);
    } catch (err) {}
  }, [selectedProductId]);

  // Master timer ticker for all products
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let hasCurrentProductJustEnded = false;

      // Update timer for active product
      if (activeProduct) {
        const target = now < activeProduct.startTime ? activeProduct.startTime : activeProduct.endTime;
        setTimeRemaining(calculateTimeRemaining(target));
      }

      // Check lifecycle transitions for all products
      setProducts((prevProducts) => {
        let changed = false;
        const updated = prevProducts.map((p) => {
          // Transition 1: Upcoming -> Active (When start time is reached)
          if (p.status === 'upcoming' && now >= p.startTime) {
            changed = true;
            return {
              ...p,
              status: now >= p.endTime ? 'ended' : 'active',
              winner: now >= p.endTime ? (p.bids?.[0] || null) : null,
            };
          }

          // Transition 2: Active -> Ended (When end time is reached)
          if (p.status === 'active' && now >= p.endTime) {
            changed = true;
            if (p.id === selectedProductId) {
              hasCurrentProductJustEnded = true;
            }
            const topBid = p.bids && p.bids.length > 0 ? p.bids[0] : null;
            return {
              ...p,
              status: 'ended',
              winner: topBid,
              endedAt: now,
            };
          }

          return p;
        });

        if (changed) {
          if (hasCurrentProductJustEnded) {
            setShowWinnerModal(true);
          }
          return updated;
        }
        return prevProducts;
      });
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [activeProduct, selectedProductId]);

  // Derived highest bid for active product
  const highestBid = useMemo(() => {
    if (activeProduct?.bids && activeProduct.bids.length > 0) {
      return activeProduct.bids[0].amount;
    }
    return activeProduct?.startingPrice || 0;
  }, [activeProduct]);

  const hasBids = useMemo(() => {
    return Boolean(activeProduct?.bids && activeProduct.bids.length > 0);
  }, [activeProduct]);

  const highestBidder = useMemo(() => {
    if (activeProduct?.bids && activeProduct.bids.length > 0) {
      return activeProduct.bids[0];
    }
    return null;
  }, [activeProduct]);

  const minRequiredBid = useMemo(() => {
    const base = hasBids ? highestBid : (activeProduct?.startingPrice || 0);
    return base + 100;
  }, [activeProduct, hasBids, highestBid]);

  /**
   * Place a new bid on the active product
   */
  const placeBid = useCallback(
    (rawName, rawAmount) => {
      const bidderName = (rawName || '').trim();
      const amount = Number(rawAmount);

      if (!activeProduct) {
        return { success: false, message: 'No active product selected.' };
      }

      const now = Date.now();

      // Check if bidding has not started yet
      if (now < activeProduct.startTime || activeProduct.status === 'upcoming') {
        return {
          success: false,
          field: 'general',
          message: 'Bidding has not started yet for this product. Please wait for the scheduled time slot.',
        };
      }

      // Check if auction ended
      if (now >= activeProduct.endTime || activeProduct.status === 'ended') {
        return {
          success: false,
          field: 'general',
          message: 'Auction has ended for this product. No further bids can be accepted.',
        };
      }

      // Name validation
      if (!bidderName) {
        return {
          success: false,
          field: 'name',
          message: 'Please enter your name to place a bid.',
        };
      }
      if (bidderName.length < 2) {
        return {
          success: false,
          field: 'name',
          message: 'Bidder name must be at least 2 characters long.',
        };
      }

      // Amount validation
      if (isNaN(amount) || amount <= 0) {
        return {
          success: false,
          field: 'amount',
          message: 'Please enter a valid numeric bid amount.',
        };
      }

      // Strict rule: Every new bid must be at least ₹100 higher than the current highest bid
      const currentHighest =
        activeProduct.bids && activeProduct.bids.length > 0
          ? activeProduct.bids[0].amount
          : activeProduct.startingPrice;

      const requiredMinAmount = currentHighest + 100;

      if (amount < requiredMinAmount) {
        return {
          success: false,
          field: 'amount',
          message: `Bid rejected: Your bid of ${formatCurrency(
            amount
          )} must be at least ₹100 higher than the current highest bid of ${formatCurrency(
            currentHighest
          )}. Minimum required bid is ${formatCurrency(requiredMinAmount)}.`,
        };
      }

      // Save bidder name in localStorage
      try {
        localStorage.setItem(USER_NAME_KEY, bidderName);
        setSavedBidderName(bidderName);
      } catch (e) {}

      // Create new bid
      const newBid = {
        id: `bid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        bidderName,
        amount,
        timestamp: Date.now(),
      };

      // Update active product's bids
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === activeProduct.id) {
            return {
              ...p,
              bids: [newBid, ...(p.bids || [])],
            };
          }
          return p;
        })
      );

      return {
        success: true,
        message: `Bid of ${formatCurrency(amount)} placed successfully!`,
        bid: newBid,
      };
    },
    [activeProduct]
  );

  /**
   * Add a new product with scheduled bidding time slot
   */
  const addProduct = useCallback(
    (productData) => {
      const title = (productData.title || '').trim();
      const startingPrice = Number(productData.startingPrice);
      const minIncrement =
        Number(productData.minIncrement) ||
        Math.max(50, Math.floor(startingPrice * 0.05));

      if (!title) {
        return { success: false, message: 'Please enter a product title.' };
      }
      if (isNaN(startingPrice) || startingPrice <= 0) {
        return { success: false, message: 'Please enter a valid starting price.' };
      }

      const now = Date.now();
      let startTime = now;
      let endTime = now + 10 * 60 * 1000;

      if (productData.startTime) {
        startTime = new Date(productData.startTime).getTime();
        if (isNaN(startTime)) startTime = now;
      }

      if (productData.endTime) {
        endTime = new Date(productData.endTime).getTime();
      } else {
        const durationMins = Number(productData.durationMinutes) || 10;
        endTime = startTime + durationMins * 60 * 1000;
      }

      const status = now < startTime ? 'upcoming' : now >= endTime ? 'ended' : 'active';

      const newProduct = {
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        lotNumber: String(products.length + 1),
        title,
        subtitle: (productData.subtitle || '').trim() || 'Auction Collectible',
        image:
          (productData.image || '').trim() ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        description:
          (productData.description || '').trim() ||
          'Authentic collectible item offered for live competitive bidding.',
        startingPrice,
        minIncrement,
        estimateLow: Math.round(startingPrice * 1.3),
        estimateHigh: Math.round(startingPrice * 2.0),
        startTime,
        endTime,
        bids: [],
        status,
        winner: null,
        endedAt: null,
        specifications: [
          { label: 'Base Price', value: formatCurrency(startingPrice) },
          { label: 'Status', value: status === 'upcoming' ? 'Scheduled' : 'Live' },
          { label: 'Time Slot', value: `${Math.round((endTime - startTime) / 60000)} mins` },
        ],
      };

      setProducts((prev) => [newProduct, ...prev]);
      setSelectedProductId(newProduct.id);
      setTimeRemaining(calculateTimeRemaining(now < startTime ? startTime : endTime));

      return {
        success: true,
        message: `Product "${title}" added and scheduled successfully!`,
        product: newProduct,
      };
    },
    [products.length]
  );

  /**
   * Start bidding immediately on an upcoming scheduled lot
   */
  const startBiddingNow = useCallback(
    (productId) => {
      const targetId = productId || activeProduct?.id;
      const now = Date.now();

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === targetId) {
            const originalDuration = Math.max(5 * 60 * 1000, p.endTime - p.startTime);
            const newEndTime = now + originalDuration;
            return {
              ...p,
              startTime: now,
              endTime: newEndTime,
              status: 'active',
            };
          }
          return p;
        })
      );
    },
    [activeProduct]
  );

  /**
   * Switch the selected product
   */
  const selectProduct = useCallback(
    (id) => {
      setSelectedProductId(id);
      const target = products.find((p) => p.id === id);
      if (target) {
        const now = Date.now();
        const nextTarget = now < target.startTime ? target.startTime : target.endTime;
        setTimeRemaining(calculateTimeRemaining(nextTarget));
      }
    },
    [products]
  );

  /**
   * Reset active product auction timer
   */
  const resetAuction = useCallback(
    (durationMinutes = 10, keepSampleBids = false) => {
      if (!activeProduct) return;
      const now = Date.now();
      const newEndTime = now + durationMinutes * 60 * 1000;

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === activeProduct.id) {
            return {
              ...p,
              startTime: now,
              endTime: newEndTime,
              status: 'active',
              winner: null,
              endedAt: null,
              bids: keepSampleBids ? p.bids : [],
            };
          }
          return p;
        })
      );
      setTimeRemaining(calculateTimeRemaining(newEndTime));
      setShowWinnerModal(false);
    },
    [activeProduct]
  );

  /**
   * End active product auction immediately
   */
  const endAuctionNow = useCallback(() => {
    if (!activeProduct) return;
    const now = Date.now();
    const topBid =
      activeProduct.bids && activeProduct.bids.length > 0
        ? activeProduct.bids[0]
        : null;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === activeProduct.id) {
          return {
            ...p,
            endTime: now,
            status: 'ended',
            winner: topBid,
            endedAt: now,
          };
        }
        return p;
      })
    );

    setTimeRemaining({
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      totalSeconds: 0,
      isExpired: true,
      isUrgent: false,
    });
    setShowWinnerModal(true);
  }, [activeProduct]);

  /**
   * Simulate a competitor bid
   */
  const simulateCompetitorBid = useCallback(() => {
    if (!activeProduct || activePhase !== 'active') return;

    const names = [
      'David Chen',
      'Elena Rostova',
      'Countess Althaus',
      'Julian Mercer',
      'Alexander Vance',
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const inc = activeProduct.minIncrement || 500;
    const base =
      activeProduct.bids && activeProduct.bids.length > 0
        ? activeProduct.bids[0].amount
        : activeProduct.startingPrice;
    const newAmount = base + inc;

    placeBid(randomName, newAmount);
  }, [activeProduct, activePhase, placeBid]);

  return {
    products,
    selectedProductId,
    item: activeProduct,
    startingPrice: activeProduct?.startingPrice || 0,
    highestBid,
    highestBidder,
    hasBids,
    bids: activeProduct?.bids || [],
    totalBids: activeProduct?.bids?.length || 0,
    minRequiredBid,
    status: activeProduct?.status || 'active',
    phase: activePhase,
    winner: activeProduct?.winner || null,
    startTime: activeProduct?.startTime || Date.now(),
    endTime: activeProduct?.endTime || Date.now(),
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
  };
}

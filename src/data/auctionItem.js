export const SAMPLE_IMAGE_PRESETS = [
  {
    name: 'Luxury Timepiece',
    url: '/images/auction-item.jpg',
  },
  {
    name: 'Vintage Camera',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Collector Tech',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fine Artwork',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  },
];

const now = Date.now();

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1-daytona',
    lotNumber: '1',
    title: '1968 Rolex Cosmograph Daytona Ref. 6239',
    subtitle: 'Stainless steel chronograph with exotic tricolor dial',
    image: '/images/auction-item.jpg',
    description:
      'Reference 6239 in stainless steel featuring the celebrated exotic tricolor dial, square subdial registers, and Valjoux 722 manual-wind movement. Preserved in pristine collector archive condition.',
    startingPrice: 150000,
    minIncrement: 1000,
    estimateLow: 250000,
    estimateHigh: 350000,
    startTime: now - 5 * 60 * 1000,
    endTime: now + 10 * 60 * 1000,
    bids: [
      {
        id: 'bid-seed-2',
        bidderName: 'Sophia Vance',
        amount: 165000,
        timestamp: now - 3 * 60 * 1000,
      },
      {
        id: 'bid-seed-1',
        bidderName: 'Marcus Sterling',
        amount: 155000,
        timestamp: now - 6 * 60 * 1000,
      },
    ],
    status: 'active',
    winner: null,
    endedAt: null,
    specifications: [
      { label: 'Reference', value: '6239' },
      { label: 'Year', value: 'circa 1968' },
      { label: 'Movement', value: 'Manual Calibre Valjoux 722' },
      { label: 'Case Dimensions', value: '36.5 mm' },
      { label: 'Material', value: 'Stainless Steel' },
    ],
  },
  {
    id: 'prod-2-leica',
    lotNumber: '2',
    title: '1954 Leica M3 Rangefinder Camera',
    subtitle: 'Original double-stroke chrome body with 50mm Summicron lens',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    description:
      'Iconic 35mm rangefinder camera featuring early double-stroke film advance, bright 0.91x optical viewfinder, and matching collapsible 50mm f/2 Summicron lens. Scheduled for upcoming bidding.',
    startingPrice: 4500,
    minIncrement: 250,
    estimateLow: 6000,
    estimateHigh: 9000,
    startTime: now + 15 * 60 * 1000,
    endTime: now + 45 * 60 * 1000,
    bids: [],
    status: 'upcoming',
    winner: null,
    endedAt: null,
    specifications: [
      { label: 'Model', value: 'Leica M3 (Double Stroke)' },
      { label: 'Year', value: '1954' },
      { label: 'Lens', value: 'Leitz 50mm f/2 Summicron' },
      { label: 'Shutter', value: 'Focal Plane 1s - 1/1000s' },
      { label: 'Serial', value: '#700142' },
    ],
  },
  {
    id: 'prod-3-apple1',
    lotNumber: '3',
    title: '1976 Apple-1 Operational Computer',
    subtitle: 'Original motherboard signed by Steve Wozniak',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description:
      'Authentic, verified working Apple-1 motherboard from Byte Shop order #22. Includes original cassette interface card, ASCII keyboard, Sanyo monitor, and period-correct power supply.',
    startingPrice: 220000,
    minIncrement: 5000,
    estimateLow: 350000,
    estimateHigh: 500000,
    startTime: now - 2 * 60 * 1000,
    endTime: now + 25 * 60 * 1000,
    bids: [],
    status: 'active',
    winner: null,
    endedAt: null,
    specifications: [
      { label: 'Processor', value: 'MOS 6502 @ 1 MHz' },
      { label: 'Year', value: '1976' },
      { label: 'RAM', value: '4 KB standard' },
      { label: 'Condition', value: 'Fully Operational' },
      { label: 'Provenance', value: 'Original Byte Shop Owner' },
    ],
  },
];

export const AUCTION_ITEM = INITIAL_PRODUCTS[0];

export const DEMO_BIDDERS = [
  'Sophia Vance',
  'Marcus Sterling',
  'Elena Rostova',
  'David Chen',
  'Julian Mercer',
];

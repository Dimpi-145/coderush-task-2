import React, { useState } from 'react';
import { X, Upload, Calendar, Clock, DollarSign, Image } from 'lucide-react';
import { SAMPLE_IMAGE_PRESETS } from '../data/auctionItem';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export function AddProductModal({ isOpen, onClose, onAddProduct, onToast }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scheduleMode, setScheduleMode] = useState('immediate'); // 'immediate' | 'scheduled'
  const [durationMinutes, setDurationMinutes] = useState('10');
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Please upload an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImageUrl(uploadEvent.target.result);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a product title.');
      return;
    }

    const price = parseFloat(startingPrice);
    if (isNaN(price) || price <= 0) {
      setErrorMsg('Please enter a valid starting base price.');
      return;
    }

    let startTime = Date.now();
    let endTime = Date.now() + 10 * 60 * 1000;

    if (scheduleMode === 'immediate') {
      const duration = parseInt(durationMinutes, 10);
      if (isNaN(duration) || duration <= 0) {
        setErrorMsg('Please choose a valid duration.');
        return;
      }
      startTime = Date.now();
      endTime = startTime + duration * 60 * 1000;
    } else {
      if (!customStartTime) {
        setErrorMsg('Please specify a scheduled start date and time.');
        return;
      }
      startTime = new Date(customStartTime).getTime();
      if (isNaN(startTime)) {
        setErrorMsg('Invalid scheduled start time.');
        return;
      }

      if (customEndTime) {
        endTime = new Date(customEndTime).getTime();
        if (endTime <= startTime) {
          setErrorMsg('Scheduled end time must be after the start time.');
          return;
        }
      } else {
        const duration = parseInt(durationMinutes, 10) || 15;
        endTime = startTime + duration * 60 * 1000;
      }
    }

    const finalImage = imageUrl.trim() || SAMPLE_IMAGE_PRESETS[0].url;

    const result = onAddProduct({
      title: title.trim(),
      subtitle: subtitle.trim(),
      startingPrice: price,
      description: description.trim(),
      image: finalImage,
      startTime,
      endTime,
    });

    if (result.success) {
      onToast?.({
        type: 'success',
        title: 'Product Added & Scheduled',
        message: `"${title.trim()}" scheduled successfully!`,
      });
      // Reset form
      setTitle('');
      setSubtitle('');
      setStartingPrice('');
      setDescription('');
      setImageUrl('');
      setCustomStartTime('');
      setCustomEndTime('');
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl transition-colors max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Add Product & Schedule Bidding
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Set starting base price and allocate bidding time slot
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Product Title */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              1. Product Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1970 Fender Stratocaster Vintage Guitar"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-900 dark:text-gray-100 transition"
              required
            />
          </div>

          {/* Subtitle / Category */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subtitle / Edition (Optional)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Sunburst finish, all-original electronics and case"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs text-gray-900 dark:text-gray-100 transition"
            />
          </div>

          {/* Starting Price (Base Price) */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              2. Starting Base Price (INR ₹) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-mono text-xs">
                ₹
              </span>
              <input
                type="number"
                step="10"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="2500"
                className="w-full pl-6 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold font-mono text-gray-900 dark:text-gray-100 transition"
                required
              />
            </div>
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Bidding opens at this base amount. All participant bids must exceed this price.
            </span>
          </div>

          {/* Schedule Bidding Time Slot */}
          <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 space-y-3">
            <label className="block font-semibold text-gray-900 dark:text-gray-100">
              3. Allocate Bidding Time Slot *
            </label>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScheduleMode('immediate')}
                className={`py-2 px-3 rounded-lg border text-center transition ${
                  scheduleMode === 'immediate'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Start Bidding Now
              </button>

              <button
                type="button"
                onClick={() => setScheduleMode('scheduled')}
                className={`py-2 px-3 rounded-lg border text-center transition ${
                  scheduleMode === 'scheduled'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Schedule Specific Slot
              </button>
            </div>

            {scheduleMode === 'immediate' ? (
              <div>
                <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Bidding Duration from Launch
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                >
                  <option value="2">2 Minutes (Quick Testing)</option>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes (Standard)</option>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="1440">24 Hours</option>
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Bidding Starts At
                  </label>
                  <input
                    type="datetime-local"
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                    required={scheduleMode === 'scheduled'}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Bidding Closes At
                  </label>
                  <input
                    type="datetime-local"
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Defaults to +15 mins if left blank
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Image */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Image
            </label>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs text-gray-900 dark:text-gray-100 mb-2 transition"
            />

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-gray-400 dark:text-gray-500">Presets:</span>
                {SAMPLE_IMAGE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => setImageUrl(preset.url)}
                    className={`px-2 py-0.5 rounded border text-[11px] transition ${
                      imageUrl === preset.url
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-[11px] font-medium transition">
                <Upload className="w-3 h-3" />
                <span>Upload file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {imageUrl && (
              <div className="mt-2.5 relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter condition, provenance, included accessories..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs text-gray-900 dark:text-gray-100 transition resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium transition shadow-sm"
            >
              Add & Schedule Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

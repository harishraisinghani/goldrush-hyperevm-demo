'use client';

import { useState } from 'react';

interface WalletInputProps {
  onAddWallet: (address: string) => void;
  isLoading?: boolean;
}

export default function WalletInput({ onAddWallet, isLoading = false }: WalletInputProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const validateAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateAddress(address.trim())) {
      setError('Please enter a valid Ethereum address (0x...)');
      return;
    }

    onAddWallet(address.trim());
    setAddress('');
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-8 mx-auto max-w-2xl">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Add Wallet Address</h2>
        <p className="text-gray-400 text-sm">
          Enter a HyperEVM wallet address to track token balances
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter HyperEVM wallet address (0x...)"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Adding Wallet...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Wallet
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
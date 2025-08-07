'use client';

import { useState, useCallback } from 'react';
import WalletInput from './WalletInput';
import BalanceCard from './BalanceCard';

interface WalletData {
  address: string;
  data: any;
  loading: boolean;
  error?: string;
}

export default function WalletDashboard() {
  const [wallets, setWallets] = useState<WalletData[]>([]);

  const fetchWalletData = useCallback(async (address: string) => {
    try {
      const response = await fetch(`/api/wallet/balances?address=${encodeURIComponent(address)}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch wallet data');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      throw error;
    }
  }, []);

  const addWallet = useCallback(async (address: string) => {
    // Check if wallet already exists
    if (wallets.some(wallet => wallet.address.toLowerCase() === address.toLowerCase())) {
      alert('Wallet already added');
      return;
    }

    // Add wallet with loading state
    const newWallet: WalletData = {
      address,
      data: null,
      loading: true
    };

    setWallets(prev => [...prev, newWallet]);

    try {
      const data = await fetchWalletData(address);
      
      setWallets(prev =>
        prev.map(wallet =>
          wallet.address === address
            ? { ...wallet, data, loading: false }
            : wallet
        )
      );
    } catch (error) {
      setWallets(prev =>
        prev.map(wallet =>
          wallet.address === address
            ? { 
                ...wallet, 
                loading: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              }
            : wallet
        )
      );
    }
  }, [wallets, fetchWalletData]);

  const removeWallet = useCallback((address: string) => {
    setWallets(prev => prev.filter(wallet => wallet.address !== address));
  }, []);

  const refreshWallet = useCallback(async (address: string) => {
    setWallets(prev =>
      prev.map(wallet =>
        wallet.address === address
          ? { ...wallet, loading: true, error: undefined }
          : wallet
      )
    );

    try {
      const data = await fetchWalletData(address);
      
      setWallets(prev =>
        prev.map(wallet =>
          wallet.address === address
            ? { ...wallet, data, loading: false }
            : wallet
        )
      );
    } catch (error) {
      setWallets(prev =>
        prev.map(wallet =>
          wallet.address === address
            ? { 
                ...wallet, 
                loading: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              }
            : wallet
        )
      );
    }
  }, [fetchWalletData]);

  const isLoading = wallets.some(wallet => wallet.loading);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            HyperEVM Wallet Tracker
          </h1>
          <p className="text-gray-400 text-lg">
            Track your token balances across HyperEVM mainnet
          </p>
        </div>

        {/* Wallet Input */}
        <WalletInput onAddWallet={addWallet} isLoading={isLoading} />

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div key={wallet.address} className="animate-fadeInUp">
              {wallet.loading ? (
                <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </h3>
                      <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                    <button
                      onClick={() => removeWallet(wallet.address)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-2"
                      title="Remove wallet"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              ) : wallet.error ? (
                <div className="bg-black/40 backdrop-blur-sm border border-red-800 rounded-xl p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </h3>
                      <p className="text-red-400 text-sm">Error loading wallet</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => refreshWallet(wallet.address)}
                        className="text-gray-400 hover:text-blue-400 transition-colors p-2"
                        title="Retry"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeWallet(wallet.address)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-2"
                        title="Remove wallet"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-red-400 mb-2">Failed to load wallet data</p>
                    <p className="text-gray-400 text-sm">{wallet.error}</p>
                  </div>
                </div>
              ) : wallet.data ? (
                <BalanceCard
                  address={wallet.address}
                  data={wallet.data}
                  onRemove={removeWallet}
                />
              ) : null}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {wallets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Wallets Added</h3>
            <p className="text-gray-400">Add your first HyperEVM wallet address to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
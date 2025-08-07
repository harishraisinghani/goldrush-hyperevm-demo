'use client';

import { useMemo } from 'react';

interface TokenBalance {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc?: string[];
  logo_url: string;
  balance: string;
  quote: number;
  quote_24h?: number;
  pretty_quote?: string;
}

interface BalanceData {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  chain_name: string;
  items: TokenBalance[];
}

interface BalanceCardProps {
  address: string;
  data: BalanceData;
  onRemove: (address: string) => void;
}

export default function BalanceCard({ address, data, onRemove }: BalanceCardProps) {
  const portfolioValue = useMemo(() => {
    return data.items.reduce((total, token) => total + (token.quote || 0), 0);
  }, [data.items]);

  const sortedTokens = useMemo(() => {
    return [...data.items].sort((a, b) => (b.quote || 0) - (a.quote || 0));
  }, [data.items]);

  const formatBalance = (balance: string, decimals: number): string => {
    const balanceNum = parseFloat(balance) / Math.pow(10, decimals);
    if (balanceNum === 0) return '0';
    if (balanceNum < 0.001) return '< 0.001';
    return balanceNum.toLocaleString(undefined, {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0
    });
  };

  const formatUSD = (value: number): string => {
    if (value === 0) return '$0.00';
    if (value < 0.01) return '< $0.01';
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const get24hChange = (current: number, previous?: number): { percentage: number; isPositive: boolean } => {
    if (!previous || previous === 0) return { percentage: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { percentage: Math.abs(change), isPositive: change >= 0 };
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {address.slice(0, 6)}...{address.slice(-4)}
          </h3>
          <p className="text-gray-400 text-sm">HyperEVM Mainnet</p>
        </div>
        <button
          onClick={() => onRemove(address)}
          className="text-gray-400 hover:text-red-400 transition-colors p-2 ml-2"
          title="Remove wallet"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Portfolio Value */}
      <div className="text-center mb-6 py-4 bg-gray-900/30 rounded-lg border border-gray-800/50">
        <p className="text-2xl font-bold text-white mb-1">
          {formatUSD(portfolioValue)}
        </p>
        <p className="text-gray-400 text-sm">Portfolio Value</p>
      </div>

      {/* Tokens List */}
      <div className="flex-1 flex flex-col">
        <h4 className="text-white font-medium mb-3">Token Balances</h4>
        
        {sortedTokens.length === 0 ? (
          <div className="text-center py-6 flex-1 flex items-center justify-center">
            <p className="text-gray-400">No tokens found</p>
          </div>
        ) : (
          <div className="space-y-2 flex-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {sortedTokens.slice(0, 10).map((token, index) => {
              const change24h = get24hChange(token.quote || 0, token.quote_24h);
              
              return (
                <div
                  key={`${token.contract_address}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-800/50 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {token.logo_url ? (
                        <img
                          src={token.logo_url}
                          alt={token.contract_ticker_symbol}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white text-xs font-medium">
                          {token.contract_ticker_symbol?.slice(0, 2) || '??'}
                        </span>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm truncate">
                        {token.contract_ticker_symbol}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {formatBalance(token.balance, token.contract_decimals)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-medium text-sm">
                      {formatUSD(token.quote || 0)}
                    </p>
                    {token.quote_24h && (
                      <p className={`text-xs ${change24h.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {change24h.isPositive ? '+' : '-'}{change24h.percentage.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {sortedTokens.length > 10 && (
              <div className="text-center py-2">
                <p className="text-gray-400 text-xs">
                  +{sortedTokens.length - 10} more tokens
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-gray-400 text-xs">
          Last updated: {new Date(data.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
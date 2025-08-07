import { NextRequest, NextResponse } from 'next/server';
import { client, HYPEREVM_CHAIN, sanitizeData } from '@/lib/covalent';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate wallet address format (basic validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Get token balances using GoldRush client SDK
    const balancesResponse = await client.BalanceService.getTokenBalancesForWalletAddress(
      HYPEREVM_CHAIN,
      address,
      {
        quoteCurrency: 'USD',
        nft: false, // Only get fungible tokens for now
        noSpam: true // Filter out spam tokens
      }
    );

    if (balancesResponse.error) {
      return NextResponse.json(
        { error: 'Failed to fetch wallet balances', details: balancesResponse.error_message },
        { status: 500 }
      );
    }

    // Sanitize BigInt values and return data
    const sanitizedData = sanitizeData(balancesResponse.data);
    
    return NextResponse.json({
      success: true,
      data: sanitizedData
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
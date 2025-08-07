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

    // Get transaction summary using GoldRush client SDK
    const transactionResponse = await client.TransactionService.getTransactionSummary(
      HYPEREVM_CHAIN,
      address,
      {
        quoteCurrency: 'USD',
        withGas: true // Include gas usage statistics
      }
    );

    if (transactionResponse.error) {
      console.error('Transaction API Response Error:', transactionResponse.error_message);
      return NextResponse.json(
        { error: 'Failed to fetch transaction summary', details: transactionResponse.error_message },
        { status: 500 }
      );
    }

    // Sanitize BigInt values and return data
    const sanitizedData = sanitizeData(transactionResponse.data);
    
    return NextResponse.json({
      success: true,
      data: sanitizedData
    });

  } catch (error) {
    console.error('Transaction API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
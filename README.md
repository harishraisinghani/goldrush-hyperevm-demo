# HyperEVM <> GoldRush Demo

## Prompts

1. Initial prompt
```
I want to build a Next.js wallet activity tracker for HyperEVM using the official GoldRush client SDK. 



REQUIREMENTS:

- Use Next.js 14 with TypeScript and Tailwind CSS

- Use the official @covalenthq/client-sdk package (latest version)

- Starting with ONLY token balance tracking (no transactions or summaries)

- Support multiple wallet addresses with add/remove functionality

- Use my GoldRush API key: `cqt_` (hardcode it in the app for now for demo purposes)

- Target HyperEVM network specifically



CRITICAL IMPLEMENTATION DETAILS:

1. Import ChainName enum from @covalenthq/client-sdk and use ChainName.HYPEREVM_MAINNET

2. Use the correct method under BalanceService. 

3. Handle BigInt serialization - create a sanitizeData function that converts BigInt to strings before JSON.stringify

4. Create clean UI with portfolio overview, token list with logos, USD values, and 24h price changes

5. Add proper error handling and loading states

6. Make it responsive with modern design inline with the Hyperliquid theme and brand (https://hyperfoundation.org/)



STRUCTURE:

- app/api/wallet/balances/route.ts (GET endpoint only)

- components/WalletInput.tsx (address input with validation)

- components/WalletDashboard.tsx (main wallet display)

- components/BalanceCard.tsx (token balances with portfolio overview)

- lib/covalent.ts (GoldRush client setup)



AVOID THESE ERRORS:

- Don't use direct API calls - use the official SDK

- Don't forget BigInt serialization handling

- Don't try to use unsupported chain names - use the ChainName enum

- Don't add transaction/summary features initially - focus on balances only

The result should be a clean, working app where I can add HyperEVM wallet addresses and see token balances with USD values immediately sorted in descending order by token value.
```

2. Prompt to add transactions
```
Add transaction summary functionality to each wallet card using the GoldRush TransactionService API with the following requirements:

API Integration:
- Create `/api/wallet/transactions` route using `client.TransactionService.getTransactionSummary()`
- Target HyperEVM mainnet with `ChainName.HYPEREVM_MAINNET`
- Handle BigInt serialization with existing `sanitizeData()` function

Data Fetching:
- Update `WalletDashboard` to fetch balance and transaction data in parallel using `Promise.all()`
- Make transaction data optional - don't fail wallet loading if transactions fail
- Pass both `balanceData` and `transactionData` to `BalanceCard` component

UI Display:
- Add "Transaction Summary" section between portfolio value and token list
- Display total transaction count (formatted with commas)
- Show transaction timeline: first and latest transaction dates
- Handle nested API response structure: `data.items[0].total_count` and `data.items[0].earliest_transaction.block_signed_at`
- Use centered, prominent layout for transaction count

Error Handling:
- Add proper null checks for nested transaction data
- Graceful fallbacks when transaction data unavailable
- Update TypeScript interfaces to match actual API response structure

Expected Result:
Each wallet card shows portfolio value, transaction count with timeline, and scrollable token list in a responsive grid layout (1/2/3 cards per row based on screen size).
```



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

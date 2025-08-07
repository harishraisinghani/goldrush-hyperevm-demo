import { GoldRushClient, ChainName } from '@covalenthq/client-sdk';

// Initialize GoldRush client with your API key
const client = new GoldRushClient("cqt_wF6WVJwWMcfPkRthqYB9c4FYTgQH");

export { client, ChainName };

// BigInt serialization helper
export function sanitizeData(data: any): any {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

// HyperEVM specific helper
export const HYPEREVM_CHAIN = ChainName.HYPEREVM_MAINNET;
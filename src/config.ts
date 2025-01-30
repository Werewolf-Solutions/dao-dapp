import { createConfig, http } from "wagmi";
import { mainnet, sepolia, localhost, anvil } from "wagmi/chains";

import { createPublicClient } from "viem";
import { foundry } from "viem/chains";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const config = createConfig({
  chains: [mainnet, sepolia, localhost, anvil],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http(),
    [anvil.id]: http(),
  },
});

export const client = createPublicClient({
  chain: foundry,
  transport: http(),
});

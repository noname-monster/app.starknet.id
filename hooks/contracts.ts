import { useContract } from "@starknet-react/core";
import starknet_id_abi from "../abi/starknet/starknet_id_abi.json";
import naming_abi from "../abi/starknet/naming_abi.json";
import pricing_abi from "../abi/starknet/pricing_abi.json";
import verifier_abi from "../abi/starknet/verifier_abi.json";
import erc20_abi from "../abi/starknet/erc20_abi.json";
import { Abi } from "starknet";

//L2 Contracts
export const starknetIdContract: string =
  "0x05290374316b104f08e60f62c96c6200a8001dc6f910ba1c6ebaa3b0469095da";

export const namingContract: string =
  "0x01eb33ff4b795ffdfa659edc5e684a3ffd9c07b3a127165de587c24e0f1ed97d";

export const pricingContract: string =
  "0x06ce507f6d3eb83bccd4a8a041a86c9f9a55eeeff10cac84bf00c3cd8a87f6ba";

export const verifierContract: string =
  "0x004107cbd7113cb1dd22cf496add384cbec7baf22a2677a0b377400430584862";

export const etherContract: string =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

// L1 Contracts
export const L1buyingContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export function useStarknetIdContract() {
  return useContract({
    abi: starknet_id_abi as Abi,
    address: starknetIdContract,
  });
}

export function useNamingContract() {
  return useContract({
    abi: naming_abi as Abi,
    address: namingContract,
  });
}

export function usePricingContract() {
  return useContract({
    abi: pricing_abi as Abi,
    address: pricingContract,
  });
}

export function useVerifierIdContract() {
  return useContract({
    abi: verifier_abi as Abi,
    address: verifierContract,
  });
}

export function useEtherContract() {
  return useContract({
    abi: erc20_abi as Abi,
    address: etherContract,
  });
}

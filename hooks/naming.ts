/* eslint-disable react-hooks/rules-of-hooks */
import BN from "bn.js";
import { BigNumberish } from "starknet/utils/number";
import { useStarknetCall } from "@starknet-react/core";
import { useNamingContract } from "./contracts";

const basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
const basicSizePlusOne = new BN(basicAlphabet.length + 1);
const bigAlphabet = "这来";
const basicAlphabetSize = new BN(basicAlphabet.length);
const bigAlphabetSize = new BN(bigAlphabet.length);

export function useDecoded(encoded: BN[]): string {
  let decoded = "";
  for (let subdomain of encoded) {
    while (!subdomain.isZero()) {
      const code = subdomain.mod(basicSizePlusOne).toNumber();
      subdomain = subdomain.div(basicSizePlusOne);
      if (code === basicAlphabet.length) {
        let code2 = subdomain.mod(bigAlphabetSize).toNumber();
        decoded += basicAlphabet[code2];
        subdomain = subdomain.div(bigAlphabetSize);
      } else decoded += basicAlphabet[code];
    }
    decoded += ".";
  }
  return decoded + "stark";
}

export function useEncoded(decoded: string): BN {
  let encoded = new BN(0);
  let multiplier = new BN(1);

  for (let char of decoded) {
    const index = basicAlphabet.indexOf(char);
    const bnIndex = new BN(basicAlphabet.indexOf(char));

    if (index !== -1) {
      // add encoded + multiplier * index
      encoded = encoded.add(multiplier.mul(bnIndex));
      multiplier = multiplier.mul(basicSizePlusOne);
    } else {
      // add encoded + multiplier * (basicAlphabetSize)
      encoded = encoded.add(multiplier.mul(basicAlphabetSize));
      multiplier = multiplier.mul(basicSizePlusOne);
      // add encoded + multiplier * index
      encoded = encoded.add(multiplier.mul(bnIndex));
      multiplier = multiplier.mul(bigAlphabetSize);
    }
  }

  return encoded;
}

type DomainData = {
  domain?: string;
  error?: string;
};

export function useDomainFromAddress(address: BigNumberish): DomainData {
  const { contract } = useNamingContract();
  const { data, error } = useStarknetCall({
    contract,
    method: "address_to_domain",
    args: [address],
  });

  if (!data || data?.["domain_len"] === 0) {
    return { domain: "", error: error ? error : "error" };
  } else {
    let domain = useDecoded(data[0] as any);
    return { domain: domain as any, error };
  }
}

type AddressData = {
  address?: any;
  error?: string;
};

export function useAddressFromDomain(domain: string): AddressData {
  const { contract } = useNamingContract();
  const encoded = [];
  for (const subdomain of domain.split("."))
    encoded.push(useEncoded(subdomain));

  const { data, error } = useStarknetCall({
    contract,
    method: "domain_to_address",
    args: [encoded],
  });

  return { address: data as any, error };
}

export function useIsValid(domain: string): boolean | string {
  for (const char of domain)
    if (!basicAlphabet.includes(char) && !bigAlphabet.includes(char))
      return char;
  return true;
}

type TokenIdData = {
  tokenId?: any;
  error?: string;
};

export function useTokenIdFromDomain(domain: string): TokenIdData {
  const { contract } = useNamingContract();
  const encoded = [];
  for (const subdomain of domain.split("."))
    encoded.push(useEncoded(subdomain));

  const { data, error } = useStarknetCall({
    contract,
    method: "domain_to_token_id",
    args: [encoded],
  });

  return { tokenId: data as any, error };
}

type ExpiryData = {
  expiry?: any;
  error?: string;
};

export function useExpiryFromDomain(domain: string): ExpiryData {
  const { contract } = useNamingContract();
  const encoded = [];
  for (const subdomain of domain.split("."))
    encoded.push(useEncoded(subdomain));

  const { data, error } = useStarknetCall({
    contract,
    method: "domain_to_expiry",
    args: [encoded],
  });

  return { expiry: data as any, error };
}

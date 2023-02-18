import React from "react";
import { TextField } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import Button from "../UI/button";
import styles from "../../styles/Home.module.css";
import { usePricingContract } from "../../hooks/contracts";
import { useAccount, useStarknetCall } from "@starknet-react/core";
import { useStarknetExecute } from "@starknet-react/core";
import { useEncoded } from "../../hooks/naming";
import BN from "bn.js";
import {
  hexToDecimal,
  isHexString,
  isStarkRootDomain,
} from "../../utils/stringService";
import { ethers } from "ethers";
import L1buying_abi from "../../abi/L1/L1Buying_abi.json";
import SelectDomain from "./selectDomains";
import { Call } from "starknet";
import { useDisplayName } from "../../hooks/displayName.tsx";
import { useDomainContext } from "../../hooks/useDomainContext";

const BatchRegister: FunctionComponent = () => {
  const { domainList } = useDomainContext();
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [duration, setDuration] = useState<number>(1);
  const [callData, setCallData] = useState<Call[]>([]);
  const { contract } = usePricingContract();
  const encodedDomain = useEncoded(domainList[0].name);

  const { account, address } = useAccount();
  const { execute } = useStarknetExecute({
    calls: callData as any,
  });
  const [domainsMinting, setDomainsMinting] = useState<Map<string, boolean>>(
    new Map()
  );

  useEffect(() => {
    if (account) {
      setTargetAddress(account.address);
    }
  }, [account]);

  // Set mulitcalls
  useEffect(() => {
    const _callData: Call[] = [];

    const genApproveCallData = (price: string) => {
      return {
        contractAddress: process.env.NEXT_PUBLIC_ETHER_CONTRACT as string,
        entrypoint: "approve",
        calldata: [process.env.NEXT_PUBLIC_NAMING_CONTRACT as string, price, 0],
      };
    };

    const genMintCallData = (tokenId: number) => {
      return {
        contractAddress: process.env.NEXT_PUBLIC_STARKNETID_CONTRACT as string,
        entrypoint: "mint",
        calldata: [new BN(tokenId).toString(10)],
      };
    };

    const genBuyCallData = (
      encodedDomain: BN,
      tokenId: number,
      duration: number
    ) => {
      return {
        contractAddress: process.env.NEXT_PUBLIC_NAMING_CONTRACT as string,
        entrypoint: "buy",
        calldata: [
          new BN(tokenId).toString(10),
          new BN(encodedDomain).toString(10),
          new BN(duration * 365).toString(10),
          0,
          hexToDecimal(targetAddress),
        ],
      };
    };

    domainList.forEach((domain) => {
      const newTokenId: number = Math.floor(Math.random() * 1000000000000);
      console.log({ domain });

      _callData.push(
        genApproveCallData(domain.price),
        genMintCallData(newTokenId),
        genBuyCallData(encodedDomain, newTokenId, domain.duration)
      );
    });

    setCallData(_callData);
  }, [domainList]);

  return (
    <div className="sm:w-full w-2/3">
      <div className="flex justify-center content-center w-full">
        <div className="text-beige m-1 mt-5">
          <Button
            onClick={() =>
              execute().then(() =>
                setDomainsMinting((prev) =>
                  new Map(prev).set(encodedDomain.toString(), true)
                )
              )
            }
            disabled={
              (domainsMinting.get(encodedDomain.toString()) as boolean) ||
              !account ||
              !duration ||
              duration < 1 ||
              !targetAddress
            }
          >
            Batch Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BatchRegister;

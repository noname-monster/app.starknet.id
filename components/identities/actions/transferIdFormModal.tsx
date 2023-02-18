import { Modal } from "@mui/material";
import { useStarknetExecute } from "@starknet-react/core";
import { useRouter } from "next/router";
import React, { FunctionComponent, useState } from "react";
import styles from "../../../styles/components/wallets.module.css";
import SelectDomain from "../../domains/selectDomains";
import Button from "../../UI/button";

type TransferFormModalProps = {
  handleClose: () => void;
  isModalOpen: boolean;
  callDataEncodedDomain: (number | string)[];
  domain?: string;
};

const TransferFormModal: FunctionComponent<TransferFormModalProps> = ({
  handleClose,
  isModalOpen,
  callDataEncodedDomain,
  domain,
}) => {
  const [targetTokenId, setTargetTokenId] = useState<number>(0);
  const router = useRouter();

  //transfer_domain
  const transfer_domain_calls = {
    contractAddress: process.env.NEXT_PUBLIC_NAMING_CONTRACT as string,
    entrypoint: "transfer_domain",
    calldata: [...callDataEncodedDomain, targetTokenId],
  };

  const { execute: transfer_domain } = useStarknetExecute({
    calls: transfer_domain_calls,
  });

  function changeTokenId(value: number): void {
    setTargetTokenId(value);
  }

  return (
    <Modal
      disableAutoFocus
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.menu}>
        <button className={styles.menu_close} onClick={handleClose}>
          <svg viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h2 className={styles.menu_title}>
          Move {domain} to a different identity
        </h2>
        <div className="mt-5 flex flex-col justify-center">
          <p className="break-all">
            <strong>Current Owner Identity number : </strong>
            {router.asPath.replace("/identities/", "")}
          </p>
          <SelectDomain
            defaultText="Choose a new starknet.id"
            tokenId={targetTokenId}
            changeTokenId={changeTokenId}
          />
          <div className="mt-5 flex justify-center">
            <Button disabled={!targetTokenId} onClick={() => transfer_domain()}>
              Change owner
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransferFormModal;


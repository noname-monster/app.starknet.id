import React from "react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import styles2 from "../styles/search.module.css";
import SearchBar from "../components/UI/searchBar";
import DomainCard from "../components/domains/domainCard";
import DomainMenu from "../components/domains/domainMenu";
import { useExpiryFromDomain } from "../hooks/naming";
import { is1234Domain, isStarkRootDomain } from "../utils/stringService";
import { useAccount } from "@starknet-react/core";
import { useDomainContext } from "../hooks/useDomainContext";
import DomainList from "../components/domains/domainList";
import Grid from "@mui/material/Grid";
import BatchRegisterBtn from "../components/domains/batchRegisterBtn";

const SearchPage: NextPage = () => {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [domain, setDomain] = useState<string>("");
  const { account } = useAccount();
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(
    undefined
  );
  const { expiry: data, error } = useExpiryFromDomain(domain);
  const { domainList } = useDomainContext();

  useEffect(() => {
    if (
      router?.query?.domain &&
      isStarkRootDomain(router.query.domain.concat(".stark") as string)
    ) {
      setDomain(router.query.domain as string);
    }
  }, [router]);

  useEffect(() => {
    const currentTimeStamp = new Date().getTime() / 1000;

    if (error || !data || is1234Domain(domain)) {
      setIsAvailable(false);
    } else {
      setIsAvailable(Number(data?.["expiry"]) < currentTimeStamp);
    }
  }, [data, error, domain]);

  useEffect(() => {
    if (account) {
      setIsMenuVisible(true);
    } else {
      setIsMenuVisible(false);
    }
  }, [isAvailable, account]);

  return (
    <div className={styles.screen}>
      <div className={styles.firstLeaf}>
        <img width="100%" alt="leaf" src="/leaves/leaf_2.png" />
      </div>
      <div className={styles.secondLeaf}>
        <img width="100%" alt="leaf" src="/leaves/leaf_1.png" />
      </div>
      <div className={styles2.container}>
        <div className="sm:w-2/3 w-4/5 mt-5">
          <SearchBar
            onChangeTypedValue={(typeValue: string) => setDomain(typeValue)}
          />
          {domain && (
            <DomainCard
              isAvailable={isAvailable}
              domain={domain.concat(".stark")}
              isConnected={Boolean(account)}
            />
          )}
        </div>
        {domainList.length > 0 && (
          <div className="sm:w-2/3 w-4/5 mt-5">
            <div className={styles.card}>
              <Grid container spacing={4}>
                <Grid item xs={5}>
                  <DomainList />
                  <BatchRegisterBtn />
                </Grid>
                <Grid item xs={6}>
                  {isMenuVisible ? (
                    <>
                      <DomainMenu
                        isAvailable={isAvailable}
                        domain={domain as string}
                      />
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </div>
          </div>
        )}

        {isMenuVisible && domainList.length === 0 ? (
          <DomainMenu isAvailable={isAvailable} domain={domain as string} />
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;

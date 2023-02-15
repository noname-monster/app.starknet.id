import React, { createContext, useContext, useState } from "react";

export type DomainContextType = {
  domainList: Domain[];
  currentDomain: Domain | undefined;
  setDomainList: React.Dispatch<React.SetStateAction<Domain[]>>;
  setCurrentDomain: React.Dispatch<React.SetStateAction<Domain | undefined>>;
};

export const DomainContext = createContext<DomainContextType>(
  {} as DomainContextType
);
export const DomainContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [domainList, setDomainList] = useState<Domain[]>([]);
  const [currentDomain, setCurrentDomain] = useState<Domain>();

  return (
    <DomainContext.Provider
      value={{ domainList, setDomainList, currentDomain, setCurrentDomain }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);

  if (context === undefined) {
    throw new Error(
      "useDomainContext must be used within a DomainContextProvider"
    );
  }

  return context;
};

import React, { createContext, useContext, useState } from "react";

export type DomainContextType = {
  domainList: Domain[];
  setDomainList: React.Dispatch<React.SetStateAction<Domain[]>>;
};

export const DomainContext = createContext<DomainContextType>(
  {} as DomainContextType
);
export const DomainContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [domainList, setDomainList] = useState<Domain[]>([
    {
      name: "test",
      duration: 1,
      tokenId: 1,
    },
  ]);

  return (
    <DomainContext.Provider value={{ domainList, setDomainList }}>
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

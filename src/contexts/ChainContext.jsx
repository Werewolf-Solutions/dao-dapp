import React, { createContext, useContext, useState } from "react";

const ChainContext = createContext();

export const ChainProvider = ({ children }) => {
  async function loadContracts() {
    // let web3 = new Web3(Web3.givenProvider);
    // let token = new web3.eth.Contract(TOKEN.abi, TOKEN.address);
  }
  const connectMetamask = async () => {
    console.log("clicked");
    if (typeof window.ethereum !== "undefined") {
    }
  };

  return (
    <ChainContext.Provider
      value={{
        connectMetamask,
        loadContracts,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export const useChain = () => useContext(ChainContext);

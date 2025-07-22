"use client";
import { createContext, ReactNode, useContext } from "react";
import { IndexListEntry } from "@/types";
import useQuoteSocket from "@/hooks/useWebSocket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface QuoteContextType {
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  indexPrices: Record<string, string>;
  sendMessage: (message: any) => void;
  sendNewIndexOrder: (order: any) => void;
  sendNewQuoteRequest: (order: any) => void;
  requestQuoteAndWait: (order: any) => Promise<number>;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  amount?: number;
  network?: number;
}

export function QuoteProvider({
  children,
  amount = 1000,
  network = 8453,
}: Props) {
  const storedIndexes = useSelector((state: RootState) => state.index.indices);
  const {
    connect,
    disconnect,
    isConnected,
    indexPrices,
    sendMessage,
    sendNewIndexOrder,
    sendNewQuoteRequest,
    requestQuoteAndWait,
  } = useQuoteSocket(storedIndexes, amount, network);

  return (
    <QuoteContext.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        indexPrices,
        sendMessage,
        sendNewIndexOrder,
        sendNewQuoteRequest,
        requestQuoteAndWait,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuoteContext() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuoteContext must be used within a QuoteProvider");
  }
  return context;
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the wallet state
interface Wallet {
  label: string;
  accounts: { address: string }[];
  provider: any;
}

interface WalletState {
  wallet: Wallet | null;
}

const initialState: WalletState = {
  wallet: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallet = action.payload;
    },
    clearWallet: (state) => {
      state.wallet = null;
    },
  },
});

export const { setWallet, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;

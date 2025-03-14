import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const ACCESS_TOKEN = 'thisisjustarandomstring';

interface AuthUser {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string;
}

const cookieState = Cookies.get(ACCESS_TOKEN);
const initialState: AuthState = {
  user: null,
  accessToken: cookieState ? JSON.parse(cookieState) : '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      Cookies.set(ACCESS_TOKEN, JSON.stringify(action.payload));
    },
    resetAccessToken: (state) => {
      state.accessToken = '';
      Cookies.remove(ACCESS_TOKEN);
    },
    reset: (state) => {
      state.user = null;
      state.accessToken = '';
      Cookies.remove(ACCESS_TOKEN);
    },
  },
});

export const { setUser, setAccessToken, resetAccessToken, reset } = authSlice.actions;
export default authSlice.reducer;

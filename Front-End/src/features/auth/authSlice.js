import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const user  = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('userToken');

const initialState = {
  user:      user  || null,
  token:     token || null,
  isLoading: false,
  isSuccess: false,
  isError:   false,
  message:   '',
};

// ── Register ──────────────────────────────────────────────────────────────────
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message = error.message || error.response?.data?.result?.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      const message = error.message || error.response?.data?.result?.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ── Verify email ──────────────────────────────────────────────────────────────
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, thunkAPI) => {
    try {
      return await authService.verifyEmail(token);
    } catch (error) {
      const message = error.response?.data?.result?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ── Forgot password ───────────────────────────────────────────────────────────
export const sendResetEmail = createAsyncThunk(
  'auth/sendResetEmail',
  async (email, thunkAPI) => {
    try {
      return await authService.sendResetEmail(email);
    } catch (error) {
      const message = error.response?.data?.result?.message || error.message || 'Failed to send reset email';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError   = false;
      state.message   = '';
    },
    logout: (state) => {
      state.user      = null;
      state.token     = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError   = false;
      state.message   = '';
      authService.logout();
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending,   (state)          => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action)  => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message   = action.payload?.result?.message || 'Registration successful';
      })
      .addCase(register.rejected,  (state, action)  => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      })

      // Login
      .addCase(login.pending,   (state)         => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user      = action.payload?.result?.data?.user  || null;
        state.token     = action.payload?.result?.data?.token || null;
        state.message   = action.payload?.result?.message     || 'Login successful';
      })
      .addCase(login.rejected,  (state, action) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      })

      // Verify email
      .addCase(verifyEmail.pending,   (state)         => { state.isLoading = true; })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message   = action.payload?.result?.message || 'Email verified successfully';
        if (state.user) state.user.isVerified = true;
      })
      .addCase(verifyEmail.rejected,  (state, action) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      })

      // Forgot password — send reset email
      .addCase(sendResetEmail.pending,   (state)         => { state.isLoading = true; })
      .addCase(sendResetEmail.fulfilled, (state)         => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message   = 'Reset email sent successfully';
      })
      .addCase(sendResetEmail.rejected,  (state, action) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      });   // ← single semicolon here, closing the entire chain
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
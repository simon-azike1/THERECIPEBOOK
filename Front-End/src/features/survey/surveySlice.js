import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/v1/user';

export const submitSurveyResponse = createAsyncThunk(
  'survey/submit',
  async (surveyData, thunkAPI) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(`${API_URL}/survey`, surveyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.result?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchSurveyAnalytics = createAsyncThunk(
  'survey/fetchAnalytics',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/survey/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.result?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  isOpen: false,
  hasSurveyed: false,
  surveySubmittedAt: localStorage.getItem('surveySubmittedAt') || null,
  analytics: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    openSurvey: (state) => {
      state.isOpen = true;
    },
    closeSurvey: (state) => {
      state.isOpen = false;
    },
    markSurveyed: (state) => {
      state.hasSurveyed = true;
      state.isOpen = false;
      const timestamp = new Date().toISOString();
      state.surveySubmittedAt = timestamp;
      localStorage.setItem('surveySubmittedAt', timestamp);
    },
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSurveyResponse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitSurveyResponse.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.hasSurveyed = true;
        state.isOpen = false;
        const timestamp = new Date().toISOString();
        state.surveySubmittedAt = timestamp;
        localStorage.setItem('surveySubmittedAt', timestamp);
      })
      .addCase(submitSurveyResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchSurveyAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSurveyAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload?.result?.data || null;
      })
      .addCase(fetchSurveyAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { openSurvey, closeSurvey, markSurveyed, reset } = surveySlice.actions;
export default surveySlice.reducer;

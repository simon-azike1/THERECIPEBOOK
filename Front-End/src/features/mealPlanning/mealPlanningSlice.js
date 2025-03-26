import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';

// Create Meal Plan
export const createMealPlan = createAsyncThunk(
  'mealPlanning/create',
  async (mealPlanData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      // Append all data to formData
      Object.keys(mealPlanData).forEach(key => {
        if (key === 'ingredients') {
          formData.append(key, JSON.stringify(mealPlanData[key]));
        } else if (key === 'recipeImage') {
          formData.append(key, mealPlanData[key]);
        } else {
          formData.append(key, mealPlanData[key]);
        }
      });

      const response = await axios.post(
        `${baseURL}/meal-planning`,
        formData,
        config
      );
      return response.data.result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get User's Meal Plans
export const getUserMealPlans = createAsyncThunk(
  'mealPlanning/getUserPlans',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/meal-planning`, config);
      return response.data.result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  mealPlans: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const mealPlanningSlice = createSlice({
  name: 'mealPlanning',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMealPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.mealPlans.push(action.payload);
      })
      .addCase(createMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.result?.message || 'Failed to create meal plan';
      })
      .addCase(getUserMealPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserMealPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.mealPlans = action.payload;
      })
      .addCase(getUserMealPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.result?.message || 'Failed to fetch meal plans';
      });
  },
});

export const { reset } = mealPlanningSlice.actions;
export default mealPlanningSlice.reducer; 
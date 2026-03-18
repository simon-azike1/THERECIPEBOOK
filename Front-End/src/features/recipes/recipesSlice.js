import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'https://therecipebook-4uw5.onrender.com/api/v1';


// Get all recipes (public)
export const getAllRecipes = createAsyncThunk(
  'recipes/getAllRecipes',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/user/recipes`);
      // Handle both success and error responses from backend
      if (response.data.result.success) {
        return response.data.result.data || [];
      } else {
        return thunkAPI.rejectWithValue(
          response.data.result.message || 'Failed to fetch recipes'
        );
      }
    } catch (error) {
      // If there's a network error or the backend returns an error status
      const errorMessage = error.response?.data?.result?.message || 
                          error.response?.data?.message || 
                          error.message ||
                          'Failed to fetch recipes';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    reset: (state) => {
      state.recipes = [];
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRecipes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload;
      })
      .addCase(getAllRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = recipesSlice.actions;
export default recipesSlice.reducer; 
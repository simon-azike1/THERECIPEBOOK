import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';


// Get all recipes (public)
export const getAllRecipes = createAsyncThunk(
  'recipes/getAllRecipes',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseURL}/user/recipes`);
      return response.data.result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recipes'
      );
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
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';

// Create Meal Plan
export const createMealPlan = createAsyncThunk(
  'mealPlanning/create',
  async (mealPlanData, thunkAPI) => {
    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      
      // Handle arrays by converting to JSON strings
      if (mealPlanData.ingredients) {
        formData.append('ingredients', JSON.stringify(mealPlanData.ingredients));
      }
      if (mealPlanData.dietaryRestrictions) {
        formData.append('dietaryRestrictions', JSON.stringify(mealPlanData.dietaryRestrictions));
      }
      if (mealPlanData.tags) {
        formData.append('tags', JSON.stringify(mealPlanData.tags));
      }

      // Handle image file
      if (mealPlanData.recipeImage) {
        formData.append('recipeImage', mealPlanData.recipeImage);
      }

      // Append other simple fields
      const simpleFields = [
        'recipeName', 'description', 'cuisineType', 'preparationTime',
        'cookingTime', 'servingSize', 'difficultyLevel', 'instructions', 'rating'
      ];

      simpleFields.forEach(field => {
        if (mealPlanData[field] !== undefined) {
          formData.append(field, mealPlanData[field]);
        }
      });

      const response = await axios.post(
        `${baseURL}/user/meal-planning`,
        formData,
        config
      );
      return response.data.result.data;
    } catch (error) {
      const message = error.response?.data?.result?.message || 'Failed to create recipe';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get User's Meal Plans
export const getUserMealPlans = createAsyncThunk(
  'mealPlanning/getUserPlans',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/user/meal-planning`, config);
      return response.data.result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.result?.message || 'Failed to fetch recipes');
    }
  }
);

// Get Single Meal Plan
export const getMealPlanById = createAsyncThunk(
  'mealPlanning/getById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${baseURL}/user/meal-planning/${id}`, config);
      return response.data.result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.result?.message || 'Failed to fetch recipe');
    }
  }
);

// Update Meal Plan
export const updateMealPlan = createAsyncThunk(
  'mealPlanning/update',
  async ({ id, updateData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      // Similar form data handling as create
      Object.keys(updateData).forEach(key => {
        if (['ingredients', 'dietaryRestrictions', 'tags'].includes(key)) {
          formData.append(key, JSON.stringify(updateData[key]));
        } else if (key === 'recipeImage' && updateData[key]) {
          formData.append(key, updateData[key]);
        } else {
          formData.append(key, updateData[key]);
        }
      });

      const response = await axios.put(
        `${baseURL}/user/meal-planning/${id}`,
        formData,
        config
      );
      return response.data.result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.result?.message || 'Failed to update recipe');
    }
  }
);

// Delete Meal Plan
export const deleteMealPlan = createAsyncThunk(
  'mealPlanning/delete',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${baseURL}/user/meal-planning/${id}`, config);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.result?.message || 'Failed to delete recipe');
    }
  }
);

const initialState = {
  mealPlans: [],
  currentMealPlan: null,
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
    clearCurrentMealPlan: (state) => {
      state.currentMealPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create cases
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
        state.message = action.payload;
      })
      // Get all cases
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
        state.message = action.payload;
      })
      // Get by ID cases
      .addCase(getMealPlanById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMealPlanById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentMealPlan = action.payload;
      })
      .addCase(getMealPlanById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update cases
      .addCase(updateMealPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.mealPlans = state.mealPlans.map(plan =>
          plan._id === action.payload._id ? action.payload : plan
        );
        state.currentMealPlan = action.payload;
      })
      .addCase(updateMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete cases
      .addCase(deleteMealPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.mealPlans = state.mealPlans.filter(plan => plan._id !== action.payload);
      })
      .addCase(deleteMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentMealPlan } = mealPlanningSlice.actions;
export default mealPlanningSlice.reducer; 
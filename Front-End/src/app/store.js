import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/auth/adminSlice';
import mealPlanningReducer from '../features/mealPlanning/mealPlanningSlice';
import recipesReducer from '../features/recipes/recipesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    mealPlanning: mealPlanningReducer,
    recipes: recipesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
}); 
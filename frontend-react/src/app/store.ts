import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import categoriesReducer, { categoriesApiSlice } from '../features/categories/categorySlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [categoriesApiSlice.reducerPath]: apiSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

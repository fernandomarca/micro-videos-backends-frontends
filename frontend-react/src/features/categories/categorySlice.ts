import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Results, Result } from "../../types/Category";
import { apiSlice } from "../api/apiSlice";

export interface Category {
  id: string,
  name: string,
  description: null | string,
  is_active: boolean,
  deleted_at: null | string,
  created_at: string,
  updated_at: string,
}

const category: Category = {
  id: "0ce68ddd-4981-4ee2-a23b-a01452b96b01",
  name: "Olive",
  description: "Earum quo at dolor",
  is_active: true,
  deleted_at: null,
  created_at: "2022-08-15T10:59:09+0000",
  updated_at: "2022-08-15T10:59:09+0000"
};

const categories: Category[] = [
  category,
  {
    ...category,
    id: "1ce68ddd-4981-4ee2-a23b-a01452b96b01",
    name: "Peach",
    is_active: false
  },
  {
    ...category,
    id: "2ce68ddd-4981-4ee2-a23b-a01452b96b01",
    name: "Apple"
  },
  {
    ...category,
    id: "3ce68ddd-4981-4ee2-a23b-a01452b96b01",
    name: "Banana",
    is_active: false
  }
];

const endpointUrl = "/categories"

const deleteCategoryMutation = (category: Category) => {
  return {
    url: `${endpointUrl}/${category.id}`,
    method: "DELETE"
  }
}

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getCategories: query<Results, void>({
      query: () => endpointUrl,
      providesTags: ["Categories"]
    }),
    deleteCategory: mutation<Result, { id: string }>({
      query: deleteCategoryMutation,
      invalidatesTags: ["Categories"]
    })
  }),
});

export const initialState = categories;

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    createCategory(state, action) {
      state.push(action.payload);
    },
    updateCategory(state, action) {
      //find index
      const index = state.findIndex((category) => category.id === action.payload.id);
      state[index] = action.payload;
    },
    deleteCategory(state, action) {
      //find index
      const index = state.findIndex((category) => category.id === action.payload.id);
      //delete
      state.splice(index, 1);
    }
  }
});

//Selectors
export const selectCategories = (state: RootState) => state.categories;
//select category by id
export const selectCategoryById = (state: RootState, id: string) => {
  const category = state.categories.find((category) => category.id === id);

  return (
    category || {
      id: "",
      name: "",
      description: "",
      is_active: false,
      deleted_at: null,
      created_at: "",
      updated_at: ""
    }
  );
}
export default categoriesSlice.reducer;
export const { createCategory, updateCategory, deleteCategory } = categoriesSlice.actions;

export const { useGetCategoriesQuery,
  useDeleteCategoryMutation
} = categoriesApiSlice;
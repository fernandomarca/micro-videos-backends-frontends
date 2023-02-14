import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { Category, createCategory } from "./categorySlice";
import CategoryForm from "./components/CategoryForm";
import { useAppDispatch } from "../../app/hooks";
import { useSnackbar } from "notistack";

type createCategoryInput = {
  name: string,
  description: string,
  is_active: boolean,
}

export const CategoryCreate = () => {
  const [isdisabled, setIsdisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryState, setCategoryState] = useState<Category>({
    id: "",
    name: "",
    description: "",
    is_active: false,
    created_at: "",
    deleted_at: null,
    updated_at: ""
  });

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryState({
      ...categoryState,
      [name]: value
    });
  };

  const handleToogle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = e.target;
    setCategoryState({
      ...categoryState,
      [name]: checked
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createCategory(categoryState));
    enqueueSnackbar("Category created successfully", { variant: "success" })
  };

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h3" component="h1">
              Create Category
            </Typography>
          </Box>
        </Box>
        <CategoryForm
          category={categoryState}
          handleChange={handleChange}
          handleToggle={handleToogle}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isdisabled={isdisabled}
        />
      </Paper>
    </Box>
  );
}



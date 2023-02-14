import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Category, selectCategoryById, updateCategory } from "./categorySlice";
import CategoryForm from "./components/CategoryForm";

type editCategoryInput = {
  name: string,
  description: string,
  is_active: boolean,
}

export const CategoryEdit = () => {
  const id = useParams().id || "";
  const [isdisabled, setIsdisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const category = useAppSelector((state) => selectCategoryById(state, id));

  const [categoryState, setCategoryState] = useState<Category>(category);

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
    dispatch(updateCategory(categoryState));
    enqueueSnackbar("Success updating category!", { variant: "success" });
  };

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h3" component="h1">
              Edit
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
import { Delete } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp, GridToolbar } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { deleteCategory, useDeleteCategoryMutation, useGetCategoriesQuery } from "./categorySlice";

export const CategoryList = () => {

  const { data, isFetching, error } = useGetCategoriesQuery();
  const [deleteCategory, deleteCategoryStatus] = useDeleteCategoryMutation();
  // const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();

  const rows: GridRowsProp = data ? data?.data.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    is_active: category.is_active,
    createdAt: new Date(category.created_at).toLocaleDateString("pt-BR")
  }))
    : [];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (row) => renderNameCell(row)
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      headerAlign: "center",
      align: "center"
    },
    {
      field: "is_active",
      headerName: "Active",
      flex: 1,
      headerAlign: "center",
      align: "center",
      type: "boolean",
      renderCell: (row) => renderIsActiveCell(row)
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      headerAlign: "center",
      align: "center"
    },
    {
      field: "id",
      headerName: "Actions",
      flex: 1,
      renderCell: (row) => renderActionCell(row),
      headerAlign: "center",
      align: "center"
    }
  ];

  const componentsProps = {
    toolbar: {
      showQuickFilter: true,
      quickFilterProps: { debounceMs: 500 },
    }
  }

  const renderNameCell = useCallback((rowData: GridRenderCellParams) => {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/categories/edit/${rowData.id}`}
      >
        <Typography color="primary">
          {rowData.value}
        </Typography>
      </Link>
    );
  }, []);
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteCategory = useCallback(async (id: string) => {
    // dispatch(deleteCategory(id));
    await deleteCategory({ id });
  }, [deleteCategory]);

  useEffect(() => {
    if (deleteCategoryStatus.isSuccess) {
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
    }
    if (deleteCategoryStatus.error) {
      enqueueSnackbar("Category not deleted", { variant: "error" });
    }
  }, [deleteCategoryStatus.error, deleteCategoryStatus.isSuccess, enqueueSnackbar]);

  const renderActionCell = useCallback((rowData: GridRenderCellParams) => {
    return (
      <IconButton
        color="secondary"
        onClick={() => handleDeleteCategory(rowData.value)}
        aria-label="delete"
      >
        <Delete />
      </IconButton>
    );
  }, [handleDeleteCategory]);

  const renderIsActiveCell = useCallback((rowData: GridRenderCellParams) => {
    return (
      <Typography color={rowData.value ? "primary" : "secondary"}>
        {rowData.value ? "Active" : "Inactive"}
      </Typography>
    );
  }, []);

  return (
    <Box
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/categories/create"
          style={{ marginBottom: "1rem" }}
        >
          New Category
        </Button>
      </Box>

      <Box
        sx={{
          height: 600,
          display: "flex"
        }}
      >
        <DataGrid
          disableColumnSelector={true}
          disableSelectionOnClick={true}
          disableColumnFilter={true}
          components={{
            Toolbar: GridToolbar
          }}
          rowsPerPageOptions={[2, 5, 10, 25, 50, 100]}
          rows={rows}
          columns={columns}
          componentsProps={componentsProps}
        />
      </Box>
    </Box>
  );
};
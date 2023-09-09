import { Delete } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridFilterModel, GridRenderCellParams, GridRowsProp, GridToolbar } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Results } from "../../../types/Category";
import { deleteCategory, useDeleteCategoryMutation } from "../categorySlice";

type Props = {
  data: Results | undefined;
  perPage: number;
  isFetching: boolean;
  rowsPerPage?: number;
  handleOnPageChange: (page: number) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
  handleOnPageSizeChange: (perPage: number) => void;
  handleDelete: (id: number) => void;
}

export function CategoriesTable({
  data,
  perPage,
  isFetching,
  rowsPerPage,
  handleOnPageChange,
  handleFilterChange,
  handleOnPageSizeChange,
  handleDelete
}: Props) {

  const [deleteCategory, deleteCategoryStatus] = useDeleteCategoryMutation();

  const componentsProps = {
    toolbar: {
      showQuickFilter: true,
      quickFilterProps: { debounceMs: 500 },
    }
  }

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

  function mapDataToGridRows(data: Results) {
    const { data: categories } = data;
    return categories.map((category) => (
      {
        id: category.id,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        createdAt: new Date(category.created_at).toLocaleDateString("pt-BR")
      }
    ));
  }

  const rows: GridRowsProp = data ? mapDataToGridRows(data) : [];

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

  const rowCount = data?.meta.total ?? 0;
  return (
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
        components={{ Toolbar: GridToolbar }}
        rowsPerPageOptions={[2, 5, 10, 25, 50, 100, perPage]}
        rows={rows}
        columns={columns}
        pageSize={perPage}
        filterMode={"server"}
        paginationMode={"server"}
        componentsProps={componentsProps}
        rowCount={rowCount}
        loading={isFetching}
        onPageChange={handleOnPageChange}
        onPageSizeChange={handleOnPageSizeChange}
        checkboxSelection={false}
      />
    </Box>
  )
}
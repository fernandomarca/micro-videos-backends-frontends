import { Typography } from "@mui/material";
import { Box, ThemeProvider } from "@mui/system";
import { SnackbarProvider } from "notistack";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Layout } from "./components/Layout";
import { appTheme } from "./config/theme";
import { CategoryCreate } from "./features/categories/CreateCategory";
import { CategoryEdit } from "./features/categories/EditCategory";
import { CategoryList } from "./features/categories/ListCategory";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Box
          component="main"
          sx={{
            height: "100vh",
            background: (theme) => theme.palette.grey[900]
          }}
        >
          <Header />
          <Layout>
            <Routes>
              <Route path="/" element={<CategoryList />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/create" element={<CategoryCreate />} />
              <Route path="/categories/edit/:id" element={<CategoryEdit />} />

              <Route path="*" element={
                <Box
                  sx={{ color: "white" }}
                >
                  <Typography variant="h1">404</Typography>
                  <Typography variant="h2">Page not found</Typography>
                </Box>
              } />
            </Routes>
          </Layout>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

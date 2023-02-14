import { Box } from '@mui/material';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import App from './App';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root')!;
const root = createRoot(container);

// const router = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <App />,
//       errorElement: <h1>Ops</h1>
//     },
//     {
//       path: "about",
//       element: <About />,
//       errorElement: <h1>Ops</h1>
//     }
//   ]
// );

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* <RouterProvider router={router} /> */}
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

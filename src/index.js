import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import App from "./App";
import Home from "./pages/Home";
import "./index.css";
import TokenSale from "./pages/TokenSale";
import DAO from "./pages/DAO";
import { ChainProvider } from "./contexts/ChainContext";
import Account from "./pages/Account";

import { WagmiProvider } from "wagmi";
import { getConfig } from "./config.ts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/token-sale",
        element: <TokenSale />,
      },
      {
        path: "/dao",
        element: <DAO />,
      },
      {
        path: "/account",
        element: <Account />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiProvider config={getConfig()}>
      <QueryClientProvider client={queryClient}>
        <ChainProvider>
          <RouterProvider router={router} />
        </ChainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

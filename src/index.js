import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { ChainProvider } from "./contexts/ChainContext";

import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import TokenSale from "./pages/TokenSale";
import DAO from "./pages/DAO";
import Account from "./pages/Account";
import Staking from "./pages/Staking.jsx";
import CompaniesHouse from "./pages/CompaniesHouse.jsx";

import { config } from "./config.ts";
import "./index.css";
import Company from "./pages/Company.jsx";
import HireEmployee from "./pages/HireEmployee.jsx";
import FireEmployee from "./pages/FireEmployee.jsx";

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
      {
        path: "/staking",
        element: <Staking />,
      },
      {
        path: "/companies",
        element: <CompaniesHouse />,
      },
      {
        path: "/companies/:companyId",
        element: <Company />,
      },
      {
        path: "/companies/:companyId/hire-employee",
        element: <HireEmployee />,
      },
      {
        path: "/companies/:companyId/fire-employee/:employeeAddress",
        element: <FireEmployee />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChainProvider>
          <RouterProvider router={router} />
        </ChainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

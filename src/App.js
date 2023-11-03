import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.js";
import BlankPage from "./pages/BlankPage.js";
import CreateTransfer from "./pages/CreateTransfer.js";
import Recipients from "./pages/Recipients.js";
import Layout from "./pages/Layout.js";
import CreateRecipient from "./pages/CreateRecipient.js";
import TransferDetail from "./pages/TransferDetail.js";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/recipients",
          element: <Recipients />,
        },
      ],
    },
    {
      path: "/transfer/create",
      element: <CreateTransfer />,
    },
    {
      path: "/transfer/detail/:id",
      element: <TransferDetail />,
    },
    {
      path: "/recipients",
      element: <Recipients />,
    },
    {
      path: "/recipient/create",
      element: <CreateRecipient />,
    },
    {
      path: "*",
      element: <BlankPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

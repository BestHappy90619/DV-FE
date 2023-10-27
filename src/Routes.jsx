// layouts
import MainLyt from "./Layouts";

// Error pages
import Error404 from "./pages/Error/404";

// pages
import Ordering from "./pages/Ordering";
import OrderingEdit from "./pages/Ordering/Edit";

// define routes
const Routes = [
  {
    path: "/",
    element: <MainLyt />,
    children: [
      {
        path: "/",
        element: <Ordering />,
      },
      {
        path: "/ordering/edit",
        element: <OrderingEdit />,
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
];

export default Routes;

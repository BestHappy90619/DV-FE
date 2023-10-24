// layouts
import MainLyt from "./Layouts";

// pages
import Error404 from "./pages/Error/404";
import Ordering from "./pages/Ordering";

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
        path: "*",
        element: <Error404 />,
      },
    ],
  },
];

export default Routes;

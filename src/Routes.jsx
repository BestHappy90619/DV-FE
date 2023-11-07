// layouts
import MainLyt from "@/Layouts/MainLyt";
import TBFileManageLyt from "@/Layouts/TBFileManageLyt";
import CTMainLyt from "@/Layouts/CTMainLyt";

// pages
/// Error
import Error404 from "@/pages/Error/404";

/// Transcribatron
import TBEditor from "@/pages/Transcribatron/TBEditor";
import MyFiles from "@/pages/Transcribatron/FileManager/MyFiles";

/// Ordering
import Ordering from "@/pages/Ordering";
import EditOrdering from "@/pages/Ordering/Edit";

// define routes
const Routes = [
  {
    path: "/",
    element: <MainLyt />,
    children: [
      {
        path: "/",
        element: <TBEditor />,
      },
      {
        path: "/filemanage/",
        element: <TBFileManageLyt />,
        children: [
          {
            path: '/filemanage/mines',
            element: <MyFiles />
          }
        ]
      },
      {
        path: "/",
        element: <CTMainLyt />,
        children: [
          {
            path: "/ordering",
            element: <Ordering />
          },
          {
            path: "/ordering/edit",
            element: <EditOrdering />
          }
        ]
      }
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export default Routes;

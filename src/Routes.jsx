// layouts
import MainLyt from "@/Layouts";
import FileManageLyt from "@/Layouts/FileManageLyt";

// pages
import Error404 from "@/pages/Error/404";
import MyFiles from "@/pages/Transcribatron/FileManager/MyFiles";
import TBEditor from "@/pages/Transcribatron/TBEditor";

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
        element: <FileManageLyt />,
        children: [
          {
            path: '/filemanage/mines',
            element: <MyFiles />
          }
        ]
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export default Routes;

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAdditionalData,
  fetchAdditionalData,
} from "../redux-toolkit/reducers/fileTreeSliceDetail";
import { selectFileTreeData } from "../redux-toolkit/reducers/fileTreeSlice";

// eslint-disable-next-line react/prop-types
function BreadCrumb({ leftSidebarWidth }) {
  const handleClick = (event) => {
    event.preventDefault();
  };

  const dispatch = useDispatch();

  const breadCrumb = useSelector(selectAdditionalData).breadCrumb;
  const data = useSelector(selectFileTreeData).date;

  const recursiveSearch = (searchName, dataArray) => {
    for (let item of dataArray) {
      if (item.name === searchName || item.FileName === searchName) {
        return item;
      }
      if (item.children) {
        const result = recursiveSearch(searchName, item.children);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  if (breadCrumb && breadCrumb.length > 0) {
    const breadCrumbCopy = [...breadCrumb];
    breadCrumbCopy[0] = "Site";
    const reversedBreadCrumb = breadCrumbCopy.slice(0, 1).concat(breadCrumbCopy.slice(1).reverse());

    const breadcrumbItems = reversedBreadCrumb.map((item, index) => (
      <Link
        key={index}
        underline="hover"
        color="inherit"
        href={item.href}
        style={{ cursor: "pointer" }}
        onClick={(event) => {
          if (item === "Site") {
            // Handle the "Site" breadcrumb click separately
            dispatch(fetchAdditionalData(0)); // Pass 0 as the ID
          } else {
            const selectedItem = recursiveSearch(item, data);
            if (selectedItem) {
              dispatch(fetchAdditionalData(selectedItem.Id || selectedItem.id));
            }
          }
          handleClick(event, item.href);
        }}
      >
        {item}
      </Link>
    ));

    return (
      <Stack
        className={`flex items-center h-5 py-0 my-0 bg-transparent`}
        style={{ marginLeft: `${leftSidebarWidth + 10}px` }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="medium" />}
          aria-label="breadcrumb"
        >
          {breadcrumbItems}
        </Breadcrumbs>
      </Stack>
    );
  }

  return (
    <Stack
      className={`flex items-center h-5 py-0 my-0 bg-transparent`}
      style={{ marginLeft: `${leftSidebarWidth + 10}px` }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="medium" />}
        aria-label="breadcrumb"
      >
        <Link
          key="root"
          underline="hover"
          color="inherit"
          href="/"
          onClick={(event) => handleClick(event, -1)}
        >
          Site
        </Link>
      </Breadcrumbs>
    </Stack>
  );
}

export default BreadCrumb;

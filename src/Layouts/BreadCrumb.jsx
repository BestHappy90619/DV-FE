import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// eslint-disable-next-line react/prop-types
function BreadCrumb({ items, leftSidebarWidth }) {
  const handleClick = (event) => {
    event.preventDefault();
  };

  // eslint-disable-next-line react/prop-types
  const breadcrumbItems = items?.map((item, index) => (
    <Link
      key={index}
      underline="hover"
      color="inherit"
      href={item.href}
      onClick={(event) => handleClick(event, item.href)}
    >
      {item}
    </Link>
  ));
  const defaultCrumb = (
    <Link
      key="root"
      underline="hover"
      color="inherit"
      href="/"
      onClick={(event) => handleClick(event, -1)} // You can use a special index like -1 for the default "/"
    >
      Site
    </Link>
  );

  // Insert the default breadcrumb at the beginning
  breadcrumbItems.unshift(defaultCrumb);
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

export default BreadCrumb;

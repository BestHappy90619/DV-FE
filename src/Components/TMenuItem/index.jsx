import { Link } from "react-router-dom";

const TMenuItem = ({ href = "", label, selected }) => {
  return (
    <Link
      to={href}
      as="li"
      className={`${
        selected
          ? "text-blue-500 border-b-blue-500"
          : ""
      } p-1 font-normal`}
    >
      <span className="text-base font-normal">{label}</span>
      {/* <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Pages
        </a>
      </Typography> */}
    </Link>
  );
};

export default TMenuItem;
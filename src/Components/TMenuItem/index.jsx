import { Link } from "react-router-dom";

const TMenuItem = ({ href = "", label, selected }) => {
  return (
    <Link
      to={href}
      as="li"
      className={`${
        selected
          ? "text-blue-500 border-b-blue-500"
          : "text-light-grey-75"
      } p-1`}
    >
      <span className="text-base">{label}</span>
    </Link>
  );
};

export default TMenuItem;
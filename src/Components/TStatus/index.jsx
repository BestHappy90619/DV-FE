import { RxDotFilled } from "react-icons/rx";
import { STATUS_ACTIVE } from "../../utils/constant";

const TStatus = ({ status }) => {
  return (
      <div className={`flex text-sm items-center ${status == STATUS_ACTIVE ? " text-custom-green" : ""}`}>
        <p>{status}</p>
        <RxDotFilled />
    </div>
  );
};

export default TStatus;

import {
  Card,
  CardBody,
} from "@material-tailwind/react";

const TTotalCard = ({text, number}) => {
  return (
    <Card className="w-1/4">
        <CardBody>
            <div className="flex justify-between">
            <span className=" text-custom-black">{ text }</span>
            <span className=" text-custom-sky">{ number }</span>
            </div>
        </CardBody>
    </Card>
  );
};

export default TTotalCard;
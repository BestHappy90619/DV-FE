import { useEffect, useState } from "react";

// material components
import { Button } from "@material-tailwind/react";

//icons
import { BsFilterLeft } from "react-icons/bs";


// custom components
import TTotalCard from "../../Components/TTotalCard";

const Ordering = () => {
  const [totals, setTotals] = useState();

  useEffect(() => {
    setTotals([
      {
        id: 1,
        text: 'Total Number:',
        number: 1024
      },{
        id: 2,
        text: 'Total New:',
        number: 630
      },{
        id: 3,
        text: 'Ready for Invoicing:',
        number: 210
      },{
        id: 4,
        text: 'How Many in Processing:',
        number: 350
      }
    ])
  }, [])

  return (
    <div className="px-32 w-full">
      <div className="w-full flex gap-8 mt-16">
        {totals && totals.map(total => <TTotalCard key={total.id} text={total.text} number={total.number} />)}
      </div>
      <div className="flex justify-center mt-24 gap-4">
        <Button className="w-52 h-12 rounded bg-custom-sky">Create New Order</Button>
        <Button variant="outlined" color="blue" className="w-52 h-12 rounded">Send an Invoice</Button>
      </div>
      <div className="mt-[90px]">
        <div className="w-full justify-between flex">
          <span className="text-custom-black text-2xl">Order List</span>
          <div className="flex gap-4 text-sm text-custom-gray">
            <span className="flex items-center"><BsFilterLeft />Filter</span>
            <span className="flex items-center"><BsFilterLeft />Sort</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordering;
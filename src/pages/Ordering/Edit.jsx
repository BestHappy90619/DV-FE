import React, {useState, useEffect} from 'react';
import { Button } from "@material-tailwind/react";

// icons
import { CiStar } from "react-icons/ci";

import TOrderingEditFileList from "../../Components/TOrderingEditFileList";
import TOrderingEditInformation from "../../Components/TOrderingEditInformation";
import TOrderingUploadFile from '../../Components/TOrderingUploadFile';

const OrderingEdit = () => {
    const [isUploading, setIsUploading] = useState(true);

    return (
        <div className="flex w-full">
            <div className="w-[250px] py-7 ">                
                <div className="w-full mb-4">
                    <div className="p-[7px] ml-10 flex flex-row">
                        <p className="font-roboto text-sm font-normal">{"<"}Back to Order List</p>
                    </div>
                </div>

                <div className="w-full bg-[#E9F0FD] mb-4 rounded-r-[20px] ">
                    <div className="p-[7px] ml-10  flex flex-row text-[#4489FE] gap-2">
                        <CiStar />
                        <p className=" font-roboto text-sm font-normal">General Information</p>
                    </div>
                </div>
            </div>
            <div className="p-8 w-[calc(100%-250px)]">
                <div className="flex gap-24 justify-center">
                    {isUploading ? <TOrderingUploadFile handleIsUploading = {(value) => setIsUploading(value)} /> : <TOrderingEditFileList />}
                    
                    <TOrderingEditInformation />
                </div>

                <div className="flex justify-end mt-3">
                    <Button variant="outlined" color="blue" className="w-52 h-12 rounded" onClick={()=>setIsUploading(true)}>Submit Order</Button>
                </div>
            </div>
        </div>
    );
}

export default OrderingEdit;
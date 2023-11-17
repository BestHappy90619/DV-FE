import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


import { Button, Textarea } from "@material-tailwind/react";

// icons
import { CiStar } from "react-icons/ci";

import DVFileLister from "@/Components/DVFileLister";
import DVFileUploader from '@/Components/DVFileUploader';

const OrderingEdit = () => {
    const [isUploading, setIsUploading] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="flex w-full">
            <div className="w-[250px] py-7 ">                
                <div className="w-full mb-4">
                    <div className="p-[7px] ml-10 flex flex-row">
                        <p className="text-sm font-normal cursor-pointer" onClick={() => navigate('/ordering')}>{"<"} Back to Order List</p>
                    </div>
                </div>

                <div className="w-full bg-[#E9F0FD] mb-4 rounded-r-[20px] ">
                    <div className="p-[7px] ml-10  flex flex-row text-[#4489FE] gap-2 cursor-pointer">
                        <CiStar />
                        <p className="text-sm font-normal">General Information</p>
                    </div>
                </div>
            </div>
            <div className="p-8 w-[calc(100%-250px)]">
                <div className="flex gap-24 justify-center">
                    {isUploading ? <DVFileUploader handleIsUploading={(value) => setIsUploading(value)} /> : <DVFileLister />}

                    <div className="border-[1px] py-7 flex flex-col rounded">
                        <label id="countries" defaultValue="AF" className="px-8 text-[#212121] text-center text-[24px] font-normal mb-[2px]">Order Information</label>

                        <label className="flex w-full justify-center px-8 text-[#757575] text-[12px] font-normal mb-[60px]">Please enter all information</label>

                        <div className="mb-[25px] flex flex-row gap-2 px-8">
                        <div className="relative h-[40px] w-[290px]">
                                <select className="h-full w-full rounded-[4px] border-[1px] border-[#DEE0E4] px-3 py-2.5 text-[#212121]  text-[14px] font-normal">
                                    <option value="brazil"  className="text-[#212121] text-[14px] font-normal">Brazil</option>
                                    <option value="uk"  className="text-[#212121] text-[14px] font-normal">UK</option>
                                </select>
                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-[4px] before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Company
                                </label>
                            </div>
                            
                            <div className="relative h-[40px] w-[200px]">
                                <select className="h-full w-full rounded-[4px] border-[1px] border-[#DEE0E4] px-3 py-2.5 text-[#212121] text-[14px] font-normal">
                                    <option value="brazil"  className="text-[#212121] text-[14px] font-normal">Brazil</option>
                                    <option value="uk"  className="text-[#212121] text-[14px] font-normal">UK</option>
                                </select>
                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-[4px] before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Client
                                </label>
                            </div>
                        </div>

                        <div className="w-[100%] px-8">
                            <Textarea label="Instruction" className="h-[350px]"/>
                        </div>           
                    </div>
                </div>

                <div className="flex justify-end mt-3">
                    <Button variant="outlined" color="blue" className="w-52 h-12 rounded" onClick={()=>setIsUploading(true)}>Submit Order</Button>
                </div>
            </div>
        </div>
    );
}

export default OrderingEdit;
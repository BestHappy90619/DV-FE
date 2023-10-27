import { Button, Progress  } from "@material-tailwind/react";

// icons
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

const fileLists = [
    {
        label: "Audio_File_1.mp3",
        totalSize: 2,
        currentSize: 2,
        resource: false
    },
    {
        label: "Audio_File_2.mp3",
        totalSize: 2,
        currentSize: 2,
        resource: false
    },
    {
        label: "Audio_File_3.mp3",
        totalSize: 2,
        currentSize: 2,
        resource: false
    },
    {
        label: "Audio_File_4.mp3",
        totalSize: 2,
        currentSize: 1.8,
        resource: true
    },
    {
        label: "Audio_File_5.mp3",
        totalSize: 2,
        currentSize: 1.5,
        resource: true
    },
    {
        label: "Audio_File_6.mp3",
        totalSize: 2,
        currentSize: 1.2,
        resource: false
    },
    {
        label: "Audio_File_7.mp3",
        totalSize: 2,
        currentSize: 1,
        resource: true
    },
    {
        label: "Audio_File_8.mp3",
        totalSize: 2,
        currentSize: 0.8,
        resource: false
    },
    {
        label: "Audio_File_9.mp3",
        totalSize: 2,
        currentSize: 0.6,
        resource: false
    },
    {
        label: "Audio_File_10.mp3",
        totalSize: 2,
        currentSize: 0.3,
        resource: false
    },
    {
        label: "Audio_File_11.mp3",
        totalSize: 2,
        currentSize: 0.2,
        resource: false
    }
]


const TOrderingEditFileList = () => {
    return (
        <div className="border-[1px] flex flex-col rounded py-7">
            <select id="countries" defaultValue="AF" className="!border-0 mx-8 outline-none font-roboto text-[#212121] text-center text-[24px] font-normal mb-[2px]">
                  <option value="AF">All Files</option>
                <option value="US">United States</option>
            </select>

            <label className="flex w-full justify-center text-[#757575] font-roboto text-[12px] font-normal mb-[25px]">Please config all files</label>

            <div className="mb-[25px] flex flex-row gap-2 px-8">
                <Button variant="outlined" color="blue" className="w-52 h-12 rounded">Mark as Resource</Button>
                <Button variant="outlined" color="blue" className="w-52 h-12 rounded">Upload More Files</Button>
            </div>

            <div className="mb-[25px] h-[422px] overflow-auto">
                {fileLists.map((fileList, index) => {
                    let pro= fileList.currentSize/fileList.totalSize
                    return (
                        <div className="flex flex-row justify-between hover:bg-[#E9F0FD] px-8">
                            <div className="flex w-full justify-between m-3 mr-[23px]">
                                <div className="flex w-2/3">
                                    <input id="default-checkbox" type="checkbox" key={index} className="w-[18px] h-[18px] text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label className="ml-2 font-roboto text-[14px] font-normal text-[#212121]">{fileList.label}</label>
                                </div>
                                <div className="flex w-1/3 justify-between gap-4">
                                    
                                    {pro === 1 ? (
                                        <>
                                            <label className="ml-2 font-roboto text-[14px] font-normal text-[#212121]">{fileList.totalSize}KB</label>
                                            <span className=" bg-custom-sky text-custom-white px-1 rounded text-sm">Res</span>
                                            <BsThreeDots />
                                        </>
                                    ) :
                                    (
                                        <>
                                            <Progress value={pro * 100} size="sm" className="my-auto" color="blue" />
                                            <AiOutlineClose className="my-auto"/>
                                        </>
                                    )
                                    }
                                          
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex flex-row gap-2 px-8">
                <Button variant="outlined" color="blue" className="bg-[#4489FE] border-[#4489FE] w-52 h-12 text-white mx-auto rounded">Add to Order Part</Button>
                <Button variant="outlined" color="blue" className="bg-[#4489FE] border-[#4489FE] w-52 h-12 text-white mx-auto rounded">Create Order Part</Button>
            </div>
        </div>
    )
}

export default TOrderingEditFileList;
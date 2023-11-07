import { Button } from "@material-tailwind/react";

// icons
import { FaCloudUploadAlt } from "react-icons/fa";

const fileLists = [
    {
        label: "Audio_File_1.mp3",
        size: "2KB",
        resource: false
    },
    {
        label: "Audio_File_2.mp3",
        size: "2KB",
        resource: false
    },
    {
        label: "Audio_File_3.mp3",
        size: "2KB",
        resource: false
    },
    {
        label: "Audio_File_4.mp3",
        size: "2KB",
        resource: true
    },
    {
        label: "Audio_File_5.mp3",
        size: "2KB",
        resource: true
    },
    {
        label: "Audio_File_6.mp3",
        size: "2KB",
        resource: false
    },
    {
        label: "Audio_File_7.mp3",
        size: "2KB",
        resource: true
    },
    {
        label: "Audio_File_8.mp3",
        size: "2KB",
        resource: false
    },
    {
        label: "Audio_File_9.mp3",
        size: "2KB",
        resource: false
    },
    {
        label: "Audio_File_10.mp3",
        size: "2KB",
        resource: false
    },
    {
        label: "Audio_File_11.mp3",
        size: "2KB",
        resource: false
    }
]


const DVFileUploader = (props) => {
    const { handleIsUploading } = props;

    return (
        <div className="border-2 border-dashed flex flex-col justify-center rounded w-[490px] h-[699px] bg-[#F9FBFF] gap-6">
            <div className="text-[#4489FE] mx-auto"><FaCloudUploadAlt className="w-16 h-11"/></div>
            <label id="countries" className="text-[#212121] font-roboto text-center text-[18px] font-normal">Drag and drop Files Here to Upload </label>
            <Button variant="outlined" className="bg-[#4489FE] border-[#4489FE] w-52 h-12 text-white mx-auto rounded" onClick={()=>handleIsUploading(false)}>Upload File</Button>
        </div>
    )
}

export default DVFileUploader;
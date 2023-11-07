import React from 'react';

//icons
import { BsFilterLeft } from "react-icons/bs";
import { GrPrevious, GrNext } from "react-icons/gr";
import { BiChevronDown } from "react-icons/bi";

import { Checkbox } from 'rsuite';
import { Button, IconButton } from "@material-tailwind/react";
import "rsuite/dist/rsuite.css";

import DVSearchBox from '@/Components/DVSearchBox';

// utils
import { getIndexFromArr } from "@/utils/Functions";

const DVTable = (props) => {
    const { title, headers, datas, checkIds, setCheckIds, currentPage, setCurrentPage, totalPageNums, hasFirstCheck, hasSearch, searchVal, setSearchVal, hasFilterSort, isFilterEnd, externalLinkonTitle, hasPagination, isPaginationCenter, footerBtn } = props;

    const [checkBoxIndeterminate, setCheckBoxIndeterminate] = React.useState(false);
    const [checkBoxChecked, setCheckBoxChecked] = React.useState(true);

    const getItemProps = (index) => ({
        key: index,
        variant: currentPage === index ? "filled" : "text",
        className: (currentPage === index ? 'bg-custom-sky text-custom-white' : 'text-custom-black') + ' w-[30px] h-[30px]',
        onClick: () => setCurrentPage(index),
    });

    const getPagination = () => {
        let ele = [];
        let i = currentPage - 3;
        for (; i <= totalPageNums; i++) {
            if (i < 1) continue;
            if (i === currentPage - 3) {
                ele.push(<IconButton key={currentPage - 3} variant="text" disabled>...</IconButton>)
                continue;
            }
            if (i === currentPage + 3 && i < totalPageNums) {
                ele.push(<IconButton key={currentPage + 3} variant="text" disabled className=" text-custom-black">...</IconButton>)
                i = totalPageNums - 1;
                continue;
            }
            ele.push(<IconButton {...getItemProps(i)}>{i}</IconButton>)
        }
        return ele;
    }

    const onChangeChecked = (id) => {
        let updatedCheckIds = JSON.parse(JSON.stringify(checkIds));
        let updatedIndex = getIndexFromArr(updatedCheckIds, 'id', id);
        updatedCheckIds[updatedIndex].checked = !updatedCheckIds[updatedIndex].checked;
        setCheckIds(updatedCheckIds);
    }

    const onChangeHeaderChkbox = () => {
        let updatedCheckIds = JSON.parse(JSON.stringify(checkIds));
        updatedCheckIds.map(item => {
            item.checked = !checkBoxChecked;
        })
        setCheckIds(updatedCheckIds);
        setCheckBoxIndeterminate(false);
    }

    React.useEffect(() => {
        let trueNums = 0, falseNums = 0;
        checkIds.map(item => item.checked ? ++trueNums : ++falseNums);
        if (trueNums === 0) {
            setCheckBoxIndeterminate(false);
            setCheckBoxChecked(false);
        } else if (falseNums === 0) {
            setCheckBoxIndeterminate(false);
            setCheckBoxChecked(true);
        } else {
            setCheckBoxIndeterminate(true);
            setCheckBoxChecked(true);
        }
    }, [checkIds])

    return (
        <>
            <div className="w-full flex mb-4">
                <span className="text-custom-black text-2xl w-52">{title}</span>
                <div className={`flex w-full ${isFilterEnd ? "justify-end" : "justify-between"} gap-4 items-center text-sm`}>
                    <div className="flex gap-4 text-sm text-custom-gray">
                        {hasSearch && (
                            <DVSearchBox value={searchVal} onChange={setSearchVal} className="bg-white w-[250px] rounded border-[1px] border-custom-light-gray h-10" />
                        )}
                        {hasFilterSort && (
                            <>
                                <span className="flex items-center cursor-pointer">Specific Order<BiChevronDown /></span>
                                <span className="flex items-center cursor-pointer"><BsFilterLeft />Filter</span>
                                <span className="flex items-center cursor-pointer"><BsFilterLeft />Sort</span>
                            </>
                        )}
                    </div>
                    <div> {externalLinkonTitle} </div>
                </div>
            </div>
            <table className="w-full">
                <thead>
                    <tr className=" border-b-2 h-14">
                        {hasFirstCheck && (
                            <th className="text-left">
                                <Checkbox
                                    indeterminate={checkBoxIndeterminate}
                                    checked={checkBoxChecked}
                                    onChange={onChangeHeaderChkbox}
                                >
                                </Checkbox>
                            </th>
                        )}
                        {headers.map((header, index) => {
                            return (
                                <th key={index} className="text-left">
                                    <span className="text-xs font-medium">{header}</span>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {datas.map((data, index) => {
                        return (
                            <tr key={index} className="border-b-2 h-20">
                                { hasFirstCheck && (<td><Checkbox value={checkIds[index].id} checked={checkIds[index].checked} onChange={onChangeChecked}></Checkbox></td>) }
                                {data.map((cell, index) => {
                                    return (
                                        <td key={index}>
                                            {cell}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className='flex mt-14 justify-between'>
                {footerBtn}
                {hasPagination && (
                    <div className={`w-full flex ${isPaginationCenter ? 'justify-center' : 'justify-end'}`}>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="text"
                                className="flex items-center gap-2"
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <GrPrevious strokeWidth={2} className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                                {getPagination()}
                            </div>
                            <Button
                                variant="text"
                                className="flex items-center gap-2"
                                onClick={() => currentPage < totalPageNums && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPageNums}
                            >
                                <GrNext strokeWidth={2} className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default DVTable;
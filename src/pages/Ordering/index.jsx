import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// icons
import { RxDotFilled } from "react-icons/rx";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsFillChatLeftTextFill, BsThreeDots } from "react-icons/bs";

// material components
import { Button, Avatar, Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";

// custom components
import DVTotalCard from "@/Components/DVTotalCard";
import DVTable from "@/Components/DVTable";

const Ordering = () => {
  const navigate = useNavigate();

  const [totals, setTotals] = useState();
  const [tableDatas, setTableDatas] = useState([]);
  const [checkIds, setCheckIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageNums, setTotalPageNums] = useState();

  const TableHeader = ['Order ID', 'Client', "Service Type", "Create Date", "Due Date", "Status", "Actions"];

  const STANDARD_TRANSCRIPTION = "Standart Transcription";
  const PRO_TRANSCRIPTION = "Pro Transcription";
  const VR_TRANSCRIPTION = "VR Transcription";
  const MULTIPLE_TRANSLATION = "Multipe Translation";

  const STATUS_PRODUCTION = 'Production';
  const STATUS_NOT_CONFIRMED  = 'Not Confirmed';
  const STATUS_UNASSIGNED = 'Unassigned';
  const STATUS_COMPLETE = 'Complete';
  const STATUS_CANCELLED = 'Cancelled';

  const datas = [
    {
      id: '234453',
      client: {
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        name: 'Serhii Movchan',
        email: 'example@gmail.com'
      },
      serviceType: STANDARD_TRANSCRIPTION,
      createDate: "08/24/2019",
      dueDate: "09/30/2019",
      status: STATUS_PRODUCTION,
      actions: {
        check: false,
        chat: false
      }
    },{
      id: '123452',
      client: {
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        name: 'Vlad Baklan',
        email: 'example@gmail.com'
      },
      serviceType: VR_TRANSCRIPTION,
      createDate: "08/24/2019",
      dueDate: "09/30/2019",
      status: STATUS_NOT_CONFIRMED,
      actions: {
        check: false,
        chat: false
      }
    },{
      id: '483042',
      client: {
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        name: 'Vasilii Kovalchuk',
        email: 'example@gmail.com'
      },
      serviceType: MULTIPLE_TRANSLATION,
      createDate: "08/24/2019",
      dueDate: "09/30/2019",
      status: STATUS_UNASSIGNED,
      actions: {
        check: false,
        chat: false
      }
    },{
      id: '102938',
      client: {
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        name: 'Daria Sosedskaya',
        email: 'example@gmail.com'
      },
      serviceType: STANDARD_TRANSCRIPTION,
      createDate: "08/24/2019",
      dueDate: "09/30/2019",
      status: STATUS_COMPLETE,
      actions: {
        check: true,
        chat: false
      }
    },{
      id: '428923',
      client: {
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        name: 'Artem Reza',
        email: 'example@gmail.com'
      },
      serviceType: PRO_TRANSCRIPTION,
      createDate: "08/24/2019",
      dueDate: "09/30/2019",
      status: STATUS_NOT_CONFIRMED,
      actions: {
        check: true,
        chat: false
      }
    },{
      id: '389203',
      client: {
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        name: 'Vlad Sklyar',
        email: 'example@gmail.com'
      },
      serviceType: VR_TRANSCRIPTION,
      createDate: "08/24/2019",
      dueDate: "09/30/2019",
      status: STATUS_CANCELLED,
      actions: {
        check: true,
        chat: true
      }
    },{
      id: '948223',
      client: {
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        name: 'Max Schytskii',
        email: 'example@gmail.com'
      },
      serviceType: STANDARD_TRANSCRIPTION,
      createDate: "08/24/2019",
      dueDate: "09/30/2019",
      status: STATUS_PRODUCTION,
      actions: {
        check: false,
        chat: false
      }
    }
  ]

  const getStatusClr = (status) => {
    switch (status) {
      case STATUS_PRODUCTION:
        return 'text-custom-sky';
      case STATUS_NOT_CONFIRMED:
        return 'text-custom-gray';
      case STATUS_UNASSIGNED:
        return 'text-custom-light-yellow';
      case STATUS_COMPLETE:
        return 'text-custom-green';
      case STATUS_CANCELLED:
        return 'text-custom-light-red';
    }
  }

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
    let newTableDatas = [];
    let newCheckIds = [];
    datas.map(data => {
      newCheckIds.push({ id: data.id, checked: false });
      let tableData = [];
      tableData.push(<span className="text-custom-black text-sm font-normal">{data.id}</span>);
      tableData.push(
        <div className="flex items-center gap-4">
          <Avatar
            variant="circular"
            alt="tania andrew"
            src={data.client.avatar}
          />
          <div>
            <p className="text-custom-black text-sm">{data.client.name}</p>
            <p className="text-custom-light-gray text-sm">{data.client.email}</p>
          </div>
        </div>
      );
      tableData.push(<span className="text-custom-sky text-sm">{data.serviceType}</span>);
      tableData.push(<span className="text-custom-gray text-sm">{data.createDate}</span>);
      tableData.push(<span className="text-custom-gray text-sm">{data.dueDate}</span>);
      tableData.push(<span className={`${getStatusClr(data.status)} flex items-center text-sm`}><RxDotFilled />{data.status}</span>);
      tableData.push(
        <span className={` flex items-center text-2xl gap-3`}>
          <AiFillCheckCircle className={`cursor-pointer ${data.actions.check ? "text-custom-medium-green" : "text-custom-medium-gray"}`} />
          <BsFillChatLeftTextFill className={`cursor-pointer ${data.actions.chat ? "text-custom-sky" : "text-custom-medium-gray"}`} />
          <Popover placement="bottom-end">
            <PopoverHandler>
                <button className="text-custom-medium-gray outline-none">
                    <BsThreeDots className="cursor-pointer" />
                </button>
            </PopoverHandler>
            <PopoverContent className="z-50 bg-opacity-0 border-opacity-0 shadow-none p-0 pt-2">
              <div className="w-40 h-14 text-custom-black text-sm rounded bg-white flex items-center pl-4 shadow-md cursor-pointer" onClick={() => navigate('/ordering/edit')}>Edit</div>
            </PopoverContent>
          </Popover>
        </span>);
      newTableDatas.push(tableData);
    })
    setTableDatas(newTableDatas);
    setCheckIds(newCheckIds);
    setTotalPageNums(15);
  }, [currentPage])

  return (
    <div className="px-32 w-full mt-16 mb-14">
      <div className="w-full flex gap-8">
        {totals && totals.map(total => <DVTotalCard key={total.id} text={total.text} number={total.number} />)}
      </div>
      <div className="flex justify-center mt-24 gap-4">
        <Button className="w-52 h-12 rounded bg-custom-sky">Create New Order</Button>
        <Button variant="outlined" color="blue" className="w-52 h-12 rounded">Send an Invoice</Button>
      </div>
      <div className="mt-[90px]">
        <DVTable
          title="Order List"
          headers={TableHeader}
          datas={tableDatas}
          checkIds={checkIds}
          setCheckIds={setCheckIds}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPageNums={totalPageNums}
          hasFirstCheck={true}
          hasFilterSort={true}
          isFilterEnd={true}
          hasPagination={true}
          footerBtn={<Button className="w-52 h-12 rounded bg-custom-medium-green">Approve Selected</Button>}
        />
      </div>
    </div>
  );
};

export default Ordering;
import FormModel from "@/components/FormModel";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role, parentsData } from "@/lib/data";
import Image from "next/image"
import Link from "next/link";

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Students",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

type Parent = {
  id: number;
  email: string;
  name: string;
  phone: string;
  students: string[];
  address: string;
}

const ParentsListPage = () => {

  const renderRow = (item: Parent) => (
    <tr key={item.id} className="border-b border-red-600 even:bg-red-50 text-sm hover:bg-slate-200">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td> 
      <td className="hidden md:table-cell">{item.students.join(",")}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items center gap-2">
          <Link href={`/list/parents/${item.id}`}>
          <FormModel table="parent" type="update" color="bg-slate-400" />  
          </Link>
          {role === "admin" && (
            <FormModel table="parent" type="delete" id={item.id} color="bg-red-600" />
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            { role==="admin" &&(
                <FormModel table="parent" type="create" color="bg-slate-200" />
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={parentsData}></Table>
      {/* Bottom Pagination */}
      <Pagination />
    </div>
  )
}

export default ParentsListPage
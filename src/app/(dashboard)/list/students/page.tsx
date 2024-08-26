import FormModel from "@/components/FormModel";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role, studentsData } from "@/lib/data";
import Image from "next/image"
import Link from "next/link";

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
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

type Student = {
  id: number;
  studentId: string;
  email?: string;
  photo: string;
  name: string;
  phone?: string;
  class: string;
  address: string;
}

const StudentsListPage = () => {

  const renderRow = (item: Student) => (
    <tr key={item.id} className="border-b border-red-600 even:bg-red-50 text-sm hover:bg-yellowLight">
      <td className="flex items-center gap-4 p-4">
        <Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500">{item.class}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <FormModel table="student" type="view" color="bg-yellow" />
          </Link>
          {role === "admin" && (
            <FormModel table="student" type="delete" id={item.id} color="bg-red-500" />
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Student</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModel table="student" type="create" color="bg-yellow" />
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={studentsData}></Table>
      {/* Bottom Pagination */}
      <Pagination />
    </div>
  )
}

export default StudentsListPage
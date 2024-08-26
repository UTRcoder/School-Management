import FormModel from "@/components/FormModel";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role, assignmentsData } from "@/lib/data";
import Image from "next/image"
import Link from "next/link";

const columns = [
  {
    header: "Subjects",
    accessor: "subjects"
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Due Date",
    accessor: "dueDate",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

const AssignmentsListPage = () => {

  const renderRow = (item: Assignment) => (
    <tr key={item.id} className="border-b border-rose-600 even:bg-rose-50 text-sm hover:bg-amber-200">
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td className="hidden md:table-cell">{item.teacher}</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td>{item.dueDate}</td>
      <td>
        <div className="flex items center gap-2">
          <Link href={`/list/students/${item.id}`}>
          <FormModel table="assignment" type="update" color="bg-zinc-600"/></Link>
          {role === "admin" && (
          <FormModel table="assignment" type="delete" id={item.id} color="bg-rose-600"/>
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
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-400">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-400">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            { role==="admin" &&(
              <FormModel table="assignment" type="create" color="bg-amber-400"/>
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={assignmentsData}></Table>
      {/* Bottom Pagination */}
      <Pagination />
    </div>
  )
}

export default AssignmentsListPage
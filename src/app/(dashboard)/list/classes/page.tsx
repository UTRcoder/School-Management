import FormModel from "@/components/FormModel";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role, classesData } from "@/lib/data";
import Image from "next/image"
import Link from "next/link";

const columns = [
  {
    header: "Class Name",
    accessor: "classes"
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden lg:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden lg:table-cell",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

type Class = {
  id: number;
  name:string;
  capacity: number;
  grade: number;
  supervisor: string;
}

const ClassListPage = () => {

  const renderRow = (item: Class) => (
    <tr key={item.id} className="border-b border-green-600 even:bg-green-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden lg:table-cell">{item.capacity}</td>
      <td className="hidden lg:table-cell">{item.grade}</td>
      <td>{item.supervisor}</td>
      <td>
        <div className="flex items center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <FormModel table="class" type="update"  color="bg-purple"/>
          </Link>
          {role === "admin" && (
            <FormModel table="class" type="delete" id={item.id} color="bg-green-600" />
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-purple">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-purple">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            { role==="admin" &&(
              <FormModel table="class" type="create" color="bg-purple" />
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={classesData}></Table>
      {/* Bottom Pagination */}
      <Pagination />
    </div>
  )
}

export default ClassListPage
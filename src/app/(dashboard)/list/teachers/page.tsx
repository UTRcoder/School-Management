import Pagination from "@/components/Pagination"
import TableSearch from "@/components/TableSearch"
import Image from "next/image"

const columns=[
  {
    header:"Info",
    accessor:"info",
  },
  {
    header:"Teacher ID",
    accessor:"teacheId",
    className:"hidden md:table-cell",
  },
  {
    header:"Subjects",
    accessor:"subjects",
    className:"hidden md:table-cell",
  },
  {
    header:"Classes",
    accessor:"Classes",
    className:"hidden md:table-cell",
  },
  {
    header:"Phone",
    accessor:"Phone",
    className:"hidden lg:table-cell",
  },
  {
    header:"Address",
    accessor:"Address",
    className:"hidden lg:table-cell",
  },
]

const TeachersListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">     
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch/>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/filter.png"alt=""width={14}height={14}/>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/sort.png"alt=""width={14}height={14}/>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/plus.png"alt=""width={14}height={14}/>
            </button>
          </div>
        </div>
      </div>
      {/* List */}
      <div className="flex"></div>
      {/* Bottom Pagination */}
      <Pagination/>
    </div>
  )
}

export default TeachersListPage
import FormModel from "@/components/FormModel";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import { role, eventsData } from "@/lib/data";
import Image from "next/image"
import Link from "next/link";

const columns = [
    {
        header: "Title",
        accessor: "title",
    },
    {
        header: "Date",
        accessor: "date",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
    },
    {
        header: "Start Time",
        accessor: "startTime",
        className: "hidden md:table-cell",
    },
    {
        header: "End Time",
        accessor: "endTime",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
    },
];

type Event = {
    id: number;
    title: string;
    class: string;
    date: string;
    startTime: string;
    endTime: string;
};

const EventsListPage = () => {

    const renderRow = (item: Event) => (
        <tr key={item.id} className="border-b border-orange-600 even:bg-cyan-50 text-sm hover:bg-orange-200">
            <td className="flex items-center gap-4 p-4">{item.title}</td>
            <td>{item.date}</td>
            <td className="hidden md:table-cell">{item.class}</td>
            <td className="hidden md:table-cell">{item.startTime}</td>
            <td className="hidden md:table-cell">{item.endTime}</td>
            <td>
                <div className="flex items center gap-2">
                    {role === "admin" && (
                       <FormModel table="event" type="update" data={item } color="bg-cyan-400"/>
                    )}
                    <Link href={`/list/students/${item.id}`}>
                       <FormModel table="event" type="view" color="bg-orange-300"/>
                    </Link>
                    {role === "admin" && (
                        <FormModel table="event" type="delete" id={item.id} color="bg-cyan-400"/>
                    )}
                </div> 
            </td>
        </tr>
    )

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Events  </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-400">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-400">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModel table="event" type="create" color="bg-amber-400"/>
                        )}
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={eventsData}></Table>
            {/* Bottom Pagination */}
            <Pagination />
        </div>
    )
}

export default EventsListPage
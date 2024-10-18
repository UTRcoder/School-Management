import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { auth } from "@clerk/nextjs/server";
import { Class, Event, Prisma, Student } from "@prisma/client";
import Image from "next/image"

// type Event = {
//     id: number;
//     title: string;
//     class: string;
//     date: string;
//     startTime: string;
//     endTime: string;
// };

type EventList = Event
    & { class: Class }

const EventsListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;
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
        ...(role === "admin" ? [{
            header: "Actions",
            accessor: "action",
        }] : []),
    ];
    const renderRow = (item: EventList) => (
        <tr key={item.id} className="border-b border-orange-600 even:bg-cyan-50 text-sm hover:bg-orange-200">
            <td className="flex items-center gap-4 p-4">{item.title}</td>
            <td>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
            <td className="hidden md:table-cell">{item.class?.name || "-"}</td>
            <td className="hidden md:table-cell">{item.startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })}</td>
            <td className="hidden md:table-cell">{item.endTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })}</td>
            <td>
                <div className="flex items center gap-2">
                    {role === "admin" && (
                        <FormContainer table="event" type="update" data={item} color="bg-cyan-400" />
                    )}
                    {/* <Link href={`/list/students/${item.id}`}>
                            <FormContainer table="event" type="view" color="bg-orange-300" />
                        </Link> */}
                    {role === "admin" && (
                        <FormContainer table="event" type="delete" id={item.id} color="bg-red-600" />
                    )}
                </div>
            </td>
        </tr>
    )
    // console.log(searchParams)
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    // URL PARAM CONDITION
    const query: Prisma.EventWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams))
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.title = { contains: value, mode: "insensitive" };
                        break;

                    default:
                        break;
                }
            }

    }

    //Role Conditions:
    // switch (role) {
    //     case "admin":
    //         break;
    //     case "teacher":
    //         query.OR=[
    //             {classId:null},
    //             {class:{lessons:{some:{teacherId:currentUserId!}}}}
    //         ]
    //     default:
    //         break;
    // }

    // better approach
    const roleConditions = {
        admin: {},
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } }
    }
    if (role !== 'admin') {
        query.OR = [
            { classId: null },
            {
                class: roleConditions[role as keyof typeof roleConditions] || {},
            },
        ];
    }


    const [data, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),

        }),
        prisma.event.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* Top */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Events  </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-400">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-400">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormContainer table="event" type="create" color="bg-cyan-400" />
                        )}
                    </div>
                </div>
            </div>
            {/* List */}
            <Table columns={columns} renderRow={renderRow} data={data}></Table>
            {/* Bottom Pagination */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default EventsListPage
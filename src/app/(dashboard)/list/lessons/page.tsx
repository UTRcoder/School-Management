import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { auth } from "@clerk/nextjs/server";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image"


// type Lesson = {
//   id: number;
//   subject:string;
//   class:number;
//   teacher: string;
// }

type LessonList = Lesson
  & { subject: Subject}
  & { class: Class }
  & { teacher: Teacher }
const LessonsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const renderRow = (item: LessonList) => (
    <tr key={item.id} className="border-b border-green-600 even:bg-green-50 text-sm hover:bg-red-100">
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td className="hidden lg:table-cell">{item.class.name}</td>
      <td className="hidden lg:table-cell">{item.startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })}</td>
      <td className="hidden lg:table-cell">{item.endTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })}</td>
      <td>{item.teacher.name + " " + item.teacher.surname}</td>
      {role === "admin" && (
        <td>
          <div className="flex items center gap-2">
            <FormContainer table="lesson" type="update" data={item} color="bg-green-500" />
            <FormContainer table="lesson" type="delete" id={item.id} color="bg-rose-600" />
          </div>
        </td>
      )}
    </tr>
  )
  // console.log(searchParams)
  const columns = [
    {
      header: "Subject Name",
      accessor: "subjects"
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden lg:table-cell",
    },
    {
      header: "StartTime",
      accessor: "startTime",
      className: "hidden lg:table-cell",
    },
    {
      header: "EndTime",
      accessor: "endTime",
      className: "hidden lg:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
    },
    ...(role === "admin" ? [{
      header: "Actions",
      accessor: "action",
    }] : []),
  ];
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAM CONDITION
  const query: Prisma.LessonWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams))
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classId = parseInt(value);
            break;
          case "teacherId":
            query.teacherId = value;
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value, mode: "insensitive" } } },
              { teacher: { name: { contains: value, mode: "insensitive" } } }
            ]
            break;

          default:
            break;
        }
      }
  }
  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany(
      {
        where: query,
        include: {
          subject: { select: { name: true } },
          class: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      },
    ),
    prisma.lesson.count({ where: query })
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="lesson" type="create" color="bg-green-400" />
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

export default LessonsListPage
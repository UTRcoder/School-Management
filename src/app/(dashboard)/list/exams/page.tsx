import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { auth } from "@clerk/nextjs/server";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image"


// type Exam = {
//   id: number;
//   subject: string;
//   class: string;
//   teacher: string;
//   date: string;
// }

type ExamList = Exam
  & {
    lesson: {
      subject: Subject;
      class: Class;
      teacher: Teacher;
      exam:Exam;
    }
  }

const ExamsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // console.log(searchParams)
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role
  const currentUserId = userId;
  const columns = [
    {
      header: "Title",
      accessor: "title",
      className: "hidden lg:table-cell ",
    },
    {
      header: "Subjects",
      accessor: "subjects"
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden lg:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
    },
    ...(role === "admin" || role === "teacher" ? [{
      header: "Actions",
      accessor: "action",
    }] : []),
  ];
  const renderRow = (item: ExamList) => (
    <tr key={item.id} className="border-b border-rose-600 even:bg-rose-50 text-sm hover:bg-amber-200">
      <td className="hidden lg:table-cell gap-4 p-4">{item?.title||"----"}</td>
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td className="hidden md:table-cell">{item.lesson.class.name}</td>
      <td className="hidden lg:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
      <td>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
      {(role === "admin" || role === "teacher") && (
        <td>
          <div className="flex items center gap-2">
            <FormContainer table="exam" type="update" data={item} color="bg-zinc-600" />
            <FormContainer table="exam" type="delete" id={item.id} color="bg-rose-600" />
          </div>
        </td>
      )}
    </tr>
  )
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAM CONDITION
  const query: Prisma.ExamWhereInput = {};
  query.lesson = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams))
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value)
            break;
          case "teacherId":
            query.lesson.teacherId = value
            break;
          case "search":
            query.lesson = {
              subject: { name: { contains: value, mode: "insensitive" } }
            }
            break;

          default:
            break;
        }
      }
  }
  //Role condition: to only show specific teachers, students etc exams in their page
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = currentUserId!;
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: currentUserId!,
          }
        },
      };
      break;
    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId!,
          }
        },
      };
      break;
    default:
      break;
  }
  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany(
      {
        where: query,
        include: {
          lesson: {
            select: {
              subject: { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
              class: { select: { name: true } }
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      },
    ),
    prisma.exam.count({ where: query })
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-400">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-400">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="exam" type="create" color="bg-amber-400" />
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

export default ExamsListPage
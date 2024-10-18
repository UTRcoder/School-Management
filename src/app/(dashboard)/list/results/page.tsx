import FormModel from "@/components/FormModel";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image"
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";


// type Result = {
//     id: number;
//     subject: string;
//     class: string;
//     teacher: string;
//     student: string;
//     date: string;
//     type: string;
//     score: number;
// };

type ResultList = {
  id: number,
  title: string;
  studentName: string,
  studentSurname: string,
  teacherName: string,
  teacherSurname: string,
  score: number,
  className: string,
  startTime: Date,
}

const ResultsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // console.log(searchParams)

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin" || role === "teacher" ? [{
      header: "Actions",
      accessor: "action",
    }] : []),
  ];
  const renderRow = (item: ResultList) => (
    <tr key={item.id} className="border-b border-rose-600 even:bg-rose-50 text-sm hover:bg-amber-200">
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.studentName + " " + item.studentSurname}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden lg:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden lg:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
      {(role === "admin" || role === "teacher") && (
        <td>
          <div className="flex items center gap-2">
            {/* <Link href={`/list/results/${item.id}`}> */}
            <FormModel table="result" type="view" data={item} color="bg-amber-300" />
            {/* </Link> */}
            <FormModel table="result" type="delete" id={item.id} color="bg-rose-600" />
          </div>
        </td>
      )}
    </tr>
  )
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAM CONDITION
  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams))
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              {
                exam: { title: { contains: value, mode: "insensitive" } },
                student: { name: { contains: value, mode: "insensitive" } },

              }
            ]
            break;

          default:
            break;
        }
      }
  }

  // ROle Condition
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } }
      ];
      break;
    case "parent":
      query.student = {
        parentId: currentUserId!,
      };
      break;
    case "student":
      query.studentId = currentUserId!;
      break;
    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany(
      {
        where: query,
        include: {
          student: { select: { name: true, surname: true } },
          exam: {
            include: {
              lesson: {
                select: {
                  class: { select: { name: true } },
                  teacher: { select: { name: true, surname: true } },
                }
              }
            }
          },
          assignment: {
            include: {
              lesson: {
                select: {
                  class: { select: { name: true } },
                  teacher: { select: { name: true, surname: true } },
                }
              }
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      },
    ),
    prisma.result.count({ where: query })
  ])
  // console.log(dataRes);
  // Make one result out of both per result
  const data = dataRes.map(item => {
    const assesment = item.exam || item.assignment;
    if (!assesment) return null;
    const isExam = "startTime" in assesment;
    return {
      id: item.id,
      title: assesment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assesment.lesson.teacher.name,
      teacherSurname: assesment.lesson.teacher.surname,
      score: item.score,
      className: assesment.lesson.class.name,
      startTime: isExam ? assesment.startTime : assesment.startDate
    }
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results  </h1>
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
              <FormModel table="result" type="create" color="bg-amber-400" />
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

export default ResultsListPage
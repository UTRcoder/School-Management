import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { auth } from "@clerk/nextjs/server";
import { Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image"
import Link from "next/link";

type SubjectList = Subject & {
  teacher: Teacher[]
}

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const {sessionClaims}=auth();
  const role=(sessionClaims?.metadata as {role?:string})?.role;
  // console.log(searchParams)
  const columns = [
    {
      header: "Subjects",
      accessor: "subjects"
    },
    {
      header: "Teachers",
      accessor: "teachers",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  const renderRow = (item: SubjectList) => (
    <tr key={item.id} className="border-b border-green-600 even:bg-green-50 text-sm hover:bg-purpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.teacher.map((teacher) => teacher.name).join(", ")}</td>
      <td>
        {role === "admin" && (
          <div className="flex items center gap-2">
            {/* <Link href={`/list/students/${item.id}`}>
            <FormContainer table="subject" type="view" color="bg-purple" />
          </Link> */}
            <FormContainer table="subject" type="update" data={item} color="bg-purple" />
            <FormContainer table="subject" type="delete" id={item.id} color="bg-green-500" />
          </div>
        )}
      </td>
    </tr>
  )
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL PARAM CONDITION
  const query: Prisma.SubjectWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams))
      if (value !== undefined) {
        switch (key) {
          // if any Parent is serached from Parents page search component, other things not need to be Searched for much, other than name
          case "search":
            query.name = { contains: value, mode: "insensitive" }
            break;

          default:
            break;
        }
      }
  }
  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany(
      {
        where: query,
        include:{
          teacher:true,
        }, 
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      },
    ),
    prisma.subject.count({ where: query })
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-purple">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-purple">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="subject" type="create" color="bg-purple"/>
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

export default SubjectListPage
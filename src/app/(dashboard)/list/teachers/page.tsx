import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination"
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { auth } from "@clerk/nextjs/server";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image"
import Link from "next/link";


/* not required now
type Teacher = {
  id: number;
  teacherId: string;
  email?: string;
  photo: string;
  name: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
}
*/
type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };


const TeachersListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const {sessionClaims}=auth();
  const role=(sessionClaims?.metadata as {role:string})?.role
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Teacher ID",
      accessor: "teacherId",
      className: "hidden md:table-cell",
    },
    {
      header: "Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: "Classes",
      accessor: "classes",
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
    ...(role === "admin"? [{
      header: "Actions",
      accessor: "action",
    }] : []),
  ];
  const renderRow = (item: TeacherList) => (
    <tr key={item.id} className="border-b border-red-600 even:bg-red-50 text-sm hover:bg-yellowLight">
      <td className="flex items-center gap-4 p-4">
        <Image src={item.img || "/noAvatar.png"} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">{item.subjects.map(subject => subject.name).join(",")}</td>
      <td className="hidden md:table-cell">{item.classes.map(classes => classes.name).join(",")}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.address}</td>
      <td>
        <div className="flex items center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <Image src="/view.png" alt="" width={16} height={16} style={{display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"100%",backgroundColor:"#fae27c", width:"32px", height:"32px"}}/>
          </Link>
          {role === "admin" && (
            <FormContainer table="teacher" type="delete"
              id={item.id}
              color="bg-red-500" />
          )}
        </div>
      </td>
    </tr>
  )
  // console.log(searchParams)
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAM CONDITION
  const query:Prisma.TeacherWhereInput ={};
  if(queryParams){
    for(const [key,value]of Object.entries(queryParams))
      if(value!==undefined){
      switch (key) {
        case "classId":
          
            query.lessons={
              some:{
                classId:parseInt(queryParams.classId!)
              }
            }
          
          break;

          // if any teacher is serached from teachers page search component, other things not need to be Searched for much other than name
          case "search": 
            query.name={contains:value,mode:"insensitive"}
          break;
      
        default:
          break;
      }}
    }

  /*
  const data= await prisma.teacher.findMany(
    // mange other related tables
    {include:{
      subjects:true,
      classes:true,
    },
    // used to show given colums on 1 page
    take:ITEM_PER_PAGE,
    skip:ITEM_PER_PAGE*(p-1),
  })

  const count =await prisma.teacher.count();
  // console.log(count);
  */

  // Merging the above commented code in one
  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany(
      {
        // NOTE: (where) is used to open only those teacher who teach in a class ex: All teachers of class 1 or 2 or ...6 
        // using quertParam can give access to all private data 
        // where:queryParams ,
        /*
        // hence only required things can be passed
        where:{
          lessons:{
            some:{
              classId:parseInt(queryParams.classId!)
              }
              }
              } */
       // or best is to hiding this, makes safe
        where:query,
        include: {
          subjects: true,
          classes: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      },
    ),
    prisma.teacher.count({where:query})
  ])
  // console.log(count)

  // console.log(data)
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
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
              <FormContainer table="teacher" type="create" color="bg-yellow" />
            )}
          </div>
        </div>
      </div>
      {/* List */}
      <Table columns={columns} renderRow={renderRow} data={data}></Table>
      {/* Bottom Pagination */}
      <Pagination page={p} count={count}/>
    </div>
  )
}

export default TeachersListPage
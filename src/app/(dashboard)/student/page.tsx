import Announcements from "@/components/Announcements"
import BigCalendarContainer from "@/components/BigCalendarContainer"
import EventCalendar from "@/components/EventCalendar"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

const StudentPage = async() => {
  const {userId}=auth();
  const classItem= await prisma.class.findMany({
    where:{
      students:{some:{id:userId!}},
    }
  })
  console.log(classItem);
  return (
    <div className="flex p-4 gap-4 flex-col xl:flex-row">
      {/* Left */}
      <div className="w-full xl:w-2/3">
        {/* Title */}
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendarContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      {/* Right*/}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  )
}

export default StudentPage
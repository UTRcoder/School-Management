import Announcements from "@/components/Announcements"
import AttendanceChartContainer from "@/components/AttendanceChartContainer"
import CountChartContainer from "@/components/CountChartContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"

const AdminPage = async ({
  searchParams
}:{
  searchParams:{
     [keys:string]:string|undefined
  }
}) => {
  return (
    <div className="flex p-4 gap-4 flex-col md:flex-row">
      {/* Left */}
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        {/* UseCads */}
        <div className="gap-4 flex justify-between flex-wrap lg:flex-nowrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="student" />
        </div>
        {/* Middle charts */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Count Chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer/>
          </div>
          {/* Attandance Chart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer/>
          </div>
        </div>
        <div className="w-full h-[350px]">
          <FinanceChart />
        </div>
      </div>
      {/* Right*/} 
      <div className="w-full md:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams}/>
        <Announcements />
      </div>
    </div>
  )
}

export default AdminPage
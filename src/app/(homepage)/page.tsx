import Announcements from "@/components/Announcements"
import AttendanceChart from "@/components/AttendanceChart"
import CountChart from "@/components/CountChart"
import EventCalendar from "@/components/EventCalendar"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"

const AdminPage = () => {
  return (
    <div className="flex p-4 gap-4 flex-col md:flex-row">
      {/* Left */}
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        {/* UseCads */}
        <div className="gap-4 flex justify-between flex-wrap lg:flex-nowrap">
          <UserCard type="student" />
          <UserCard type="teachers" />
          <UserCard type="parents" />
          <UserCard type="staff" />
        </div>
        {/* Middle charts */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Count Chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* Attandance Chart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        <div className="w-full h-[350px]">
          <FinanceChart />
        </div>
      </div>
      {/* Right*/}
      <div className="w-full md:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  )
}

export default AdminPage
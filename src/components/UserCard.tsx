import prisma from "@/lib/prisma";
import Image from "next/image"

const UserCard = async({
  type,
}:{
  type:"admin"|"teacher"|"parent"|"student";

})=>{
  const modelMap:Record <typeof type , any>={
    admin:prisma.admin,
    teacher:prisma.teacher,
    student:prisma.student,
    parent:prisma.parent,
  };
  const data=await modelMap[type].count();
  return (
    <div className="rounded-2xl p-4 odd:bg-purple even:bg-yellow flex-1 min-w-[120px]">
        <div className="flex justify-between items-center gap-1">
            <span className="text-[10px] text-green-600 rounded-full bg-white py-1 px-2">
                {new Date().toLocaleDateString()}
            </span>
            <Image src="/more.png" alt="more" width={20} height={20}/>
        </div>
        <h1 className="text-2xl font-semibold my-2">{data}</h1>
        <h2 className="capitalize text-gray-500">{type}</h2>
    </div>
  )
}

export default UserCard;
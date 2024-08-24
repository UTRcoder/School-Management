import Image from "next/image"

const UserCard = ({type}:{type:string}) => {
  return (
    <div className="rounded-2xl p-4 odd:bg-purple even:bg-yellow flex-1 min-w-[120px]">
        <div className="flex justify-between items-center gap-1">
            <span className="text-[10px] text-green-600 rounded-full bg-white py-1 px-2">
                24/2025
            </span>
            <Image src="/more.png" alt="more" width={20} height={20}/>
        </div>
        <h1 className="text-2xl font-semibold my-2">1.234</h1>
        <h2 className="capitalize text-gray-500">{type}</h2>
    </div>
  )
}

export default UserCard;
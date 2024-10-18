import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Navbar = async() => {
    const user=await currentUser();
    const role=user?.publicMetadata.role as string
    return (
        <div className="flex item-center justify-end md:justify-between p-4">
            {/* Search Box */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src="/search.png" alt="" width={14} height={14} />
                <input type="text" placeholder="Search..." className="w-[200px] p-2 outline-none bg-transparent" />
            </div>
            {/* Icon and Names */}
            <div className="flex item-center gap-6">
                <div className="bg-white rounded-full h-7 w-7 flex item-center justify-center cursor-pointer">
                    <Image src="/message.png" alt="" width={30} height={20} />
                </div>
                <div className="bg-white rounded-full h-7 w-7 flex item-center justify-center cursor-pointer relative">
                    <Image src="/announcement.png" alt="" width={30} height={20} />
                    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center
                    bg-purple text-black font-bold rounded-full text-xs">1</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium leading-3 mt-[0.5rem]">Name</span>
                    <span className="text-[10px] text-right text-gray-600">{role}</span>
                </div>
                {/* <Image src="/avatar.png" alt="" width={36} height={20} className="rounded-full"/> */}
                <UserButton/>
            </div>
        </div>
    )
}

export default Navbar;
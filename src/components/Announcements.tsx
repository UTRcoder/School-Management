import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Announcements = async () => {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const roleCondition = {
        teacher: { lessons: { some: { teacherId: userId! } } },
        parent: { students: { some: { parentId: userId!} } },
        student: { students: { some: { id: userId!} } },
    };
    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: "desc" },
        where: {
            ...(role !== "admin" && {
                OR: [
                    { classId: null },
                    { class: roleCondition[role as keyof typeof roleCondition] || {} },
                ],
            }),
        },
    });
    
    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex item-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {data[0] && (<div className="bg-skyLight rounded-md p-4">
                    <div className="flex item-center justify-between">
                        <h2 className="font-medium">{data[0].title}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
                </div>)}
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {data[1] && (<div className="bg-purpleLight rounded-md p-4">
                    <div className="flex item-center justify-between">
                        <h2 className="font-medium">{data[1].title}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
                </div>)}
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {data[2] && (<div className="bg-yellowLight rounded-md p-4">
                    <div className="flex item-center justify-between">
                        <h2 className="font-medium">{data[2].title}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{data[2].description}.</p>
                </div>)}
            </div>
        </div>
    )
}

export default Announcements;

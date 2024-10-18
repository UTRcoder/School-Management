// import { auth } from "@clerk/nextjs/server";

// const {userId,sessionClaims}=auth();
// export const role=(sessionClaims?.metadata as{role:string}).role;
// export const currentUserId=userId;

// can use this code (updated one) for best results
/*
const getLatestMonday = (): Date => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const latestMonday = today;
    latestMonday.setDate(today.getDate() - daysSinceMonday);
    return latestMonday;
};

export const adjustScheduleToCurrentWeek = (
    lessons:
        {
            title: string;
            start: Date;
            end: Date

        }[]
): {
    title: string;
    start: Date;
    end: Date
}[] => {
    const latestMonday = getLatestMonday();
*/
const currentWorkWeek=()=>{
    const today=new Date();
    const dayOfWeek=today.getDay();

    const startOfWeek=new Date(today);
    if(dayOfWeek===0){
        startOfWeek.setDate(today.getDate()+1);
    }
    if(dayOfWeek===6){
        startOfWeek.setDate(today.getDate()+2);
    }
    else{
        startOfWeek.setDate(today.getDate()-(dayOfWeek-1));
    }
    startOfWeek.setHours(0,0,0,0);

    //endofWeek
    const endofWeek=new Date(startOfWeek);
    endofWeek.setDate(startOfWeek.getDate()+4);
    endofWeek.setHours(23,59,59,999);
    
    return {startOfWeek,endofWeek};
};

export const adjustScheduleToCurrentWeek=(
    lessons:{
        title:string;
        start:Date;
        end:Date;
    }[]
):{
    title:string;
    start:Date;
    end:Date;
}[]=>{
    const {startOfWeek,endofWeek}=currentWorkWeek();

    return lessons.map((lesson)=>{
        const lessonDayOfWeek=lesson.start.getDay();
        const daysFromMonday=lessonDayOfWeek===0?6:lessonDayOfWeek-1;

        const adjustedStartDate=new Date(startOfWeek);
        adjustedStartDate.setDate(startOfWeek.getDate()+daysFromMonday);
        adjustedStartDate.setHours(
            lesson.start.getHours(),
            lesson.start.getMinutes(),
            lesson.start.getSeconds(),
        );
        
        const adjustedEndDate=new Date(adjustedStartDate);
        adjustedEndDate.setHours(
            lesson.end.getHours(),
            lesson.end.getMinutes(),
            lesson.end.getSeconds(),
        );

        return {
            title:lesson.title,
            start:adjustedStartDate,
            end:adjustedEndDate,
        }
    })
};
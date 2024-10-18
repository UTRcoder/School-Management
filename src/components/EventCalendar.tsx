"use client"
import { useRouter } from 'next/navigation';
import {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// // temporary data
// const events=[
//     {
//         id:1,
//         title: "Lorem ipsum dolor",
//         time:"12:00 PM-2:00 PM",
//         desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, nostrum"
//     },
//     {
//         id:2,
//         title: "Lorem ipsum dolor ",
//         time:"12:00 PM-2:00 PM",
//         desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, nostrum"
//     },
//     {
//         id:3,
//         title: "Lorem ipsum dolor ",
//         time:"12:00 PM-2:00 PM",
//         desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, nostrum"
//     },
// ]

const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    const router=useRouter();
    useEffect(()=>{
        if(value instanceof Date){
            router.push(`?date=${value.toLocaleDateString('en-US')}`)
        }
    },[value,router]);    
    return <Calendar onChange={onChange} value={value}/>
}

export default EventCalendar
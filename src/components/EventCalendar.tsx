"use client"
import Image from 'next/image';
import {useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// temporary data
const events=[
    {
        id:1,
        title: "Lorem ipsum dolor",
        time:"12:00 PM-2:00 PM",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, nostrum"
    },
    {
        id:2,
        title: "Lorem ipsum dolor ",
        time:"12:00 PM-2:00 PM",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, nostrum"
    },
    {
        id:3,
        title: "Lorem ipsum dolor ",
        time:"12:00 PM-2:00 PM",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, nostrum"
    },
]

const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());

    return (
      <div>
        <Calendar onChange={onChange} value={value} />
        <div className="flex items-center justify-between">
            <h1 className='text-xl font-semibold my-4'>Events</h1>
            <Image src="/moreDark.png" alt='' width={20} height={20}/>
        </div>
        <div className="flex flex-col gap-4">
            {events.map(event=>(
                <div className="p-1 rounded-md border-2 border-gray-100 border-t-4
                odd:border-t-sky even:border-t-purple" key={event.id}>
                    <div className="flex items-center justify-between">
                        <h1 className='font-semibold text-gray-600'>{event.title}</h1>
                        <span className='text-gray-400 text-xs'>{event.time}</span>
                    </div>
                    <p className='mt-2 text-gray-500 text-xs'>{event.desc}</p>
                </div>
            ))}
        </div> 
      </div>
    );
}

export default EventCalendar
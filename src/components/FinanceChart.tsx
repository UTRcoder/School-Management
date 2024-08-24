"use client"
import Image from "next/image"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const data = [
    {
        name: 'Jan',
        income: 2000,
        expense: 2400,
    },
    {
        name: 'Feb',
        income: 4000,
        expense: 400,
    },
    {
        name: 'Mar',
        income: 900,
        expense: 4500,
    },
    {
        name: 'Apr',
        income: 4000,
        expense: 2400,
    },
    {
        name: 'May',
        income: 3000,
        expense: 2400,
    },
    {
        name: 'Jun',
        income: 4300,
        expense: 2400,
    },
    {
        name: 'Jul',
        income: 2000,
        expense: 2400,
    },
    {
        name: 'Aug',
        income: 2300,
        expense: 400,
    },
    {
        name: 'Sep',
        income: 4000,
        expense: 2400,
    },
    {
        name: 'Oct',
        income: 4000,
        expense: 2400,
    },
    {
        name: 'Nov',
        income: 400,
        expense: 2400,
    },
    {
        name: 'Dec',
        income: 4000,
        expense: 2400,
    },
];

const FinanceChart = () => {
    return (
        <div className="w-full h-full bg-white rounded-xl p-4">
            {/* // Title */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="" width={20}
                    height={20} />
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis className="hidden xl:flex" dataKey="name" axisLine={false} tick={{ fill: "#d1d5df" }} tickLine={false} tickMargin={10} />
                    <YAxis axisLine={false} tick={{ fill: "#d1d5df" }} tickLine={false} tickMargin={10} />
                    <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
                    <Legend align='center' verticalAlign='top'
                        wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }} />
                    <Line type="monotone"
                        dataKey="income" stroke="#C3EBFA"
                        strokeWidth={5} />
                    <Line type="monotone"
                        dataKey="expense" stroke="#CFCEFF"
                        strokeWidth={5} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FinanceChart
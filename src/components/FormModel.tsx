"use client"

import Image from "next/image";
import { useState } from "react";

// pre-loaded and show directly.
// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";
import dynamic from "next/dynamic";

// load and then show form
const AnnouncementForm=dynamic(()=>import("./forms/AnnouncementForm"));
const AssignmentForm=dynamic(()=>import("./forms/AssignmentForm"));
const ClassForm=dynamic(()=>import("./forms/ClassForm"));
const EventForm=dynamic(()=>import("./forms/EventForm"));
const ExamForm=dynamic(()=>import("./forms/ExamForm"));
const ParentForm=dynamic(()=>import("./forms/ParentForm"));
const ResultForm=dynamic(()=>import("./forms/ResultForm"));
const StudentForm=dynamic(()=>import("./forms/StudentForm"));
const SubjectForm=dynamic(()=>import("./forms/SubjectForm"));
const TeacherForm=dynamic(()=>import("./forms/TeacherForm"));

const forms: {
    [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
    teacher: (type, data) => <TeacherForm type={type} data={data} />,
    student: (type, data) => <StudentForm type={type} data={data} />,
    announcement: (type, data) => <AnnouncementForm type={type} data={data} />,
    class: (type, data) => <ClassForm type={type} data={data} />,
    event: (type, data) => <EventForm type={type} data={data} />,
    exam: (type, data) => <ExamForm type={type} data={data} />,
    assignment: (type, data) => <AssignmentForm type={type} data={data} />,
    parent: (type, data) => <ParentForm type={type} data={data} />,
    result: (type, data) => <ResultForm type={type} data={data} />,
    subject: (type, data) => <SubjectForm type={type} data={data} />,
};

const FormModel = ({ table, type, data, id, color }: {
    table: "teacher" | "student"
    | "parent" | "subject" | "class" |
    "lesson" | "exam" | "assignment"
    | "result" | "attendance" | "event"
    | "announcements";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: number;
    color?: string;
}) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const iName = type === "create" ? "plus.png" : type === "update" ? "edit.png" : type === "view" ? "view.png" : "delete.png";

    //useState
    const [open, setOpen] = useState(false);

    // delete model
    const Form = () => {
        return type === "delete" && id ? (
            <form action="" className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">Are You Sure to delete {table}? All data will be lost</span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center ">
                    Delete
                </button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](type, data)
        ) : (
            "Form not found"
        );
    };

    return (
        <>
            <button className={`${size} flex items-center justify-center rounded-full ${color}`} onClick={() => setOpen(true)}>
                <Image src={`/${iName}`} alt="" width={16} height={16} />
            </button>
            {
                open && (
                    <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                            <Form />
                            <div className="absolute top-4 right-4 cursor-pointer bg-white rounded-full" onClick={() => setOpen(false)}>
                                <Image src="/close.png" alt="" width={14} height={14}></Image>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default FormModel
"use client"

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
// pre-loaded and show directly.
// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";
import dynamic from "next/dynamic";
import { useFormState } from "react-dom";
import { 
    deleteSubject,
    deleteClass,
    deleteTeacher,
    deleteStudent,
    deleteExam,
    deleteEvent,
    deleteParent,
    deleteAssignment,
} from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";
import AnnouncementForm from "./forms/AnnouncementForm";


const deleteActionMap = {
    subject: deleteSubject,
    class: deleteClass,
    teacher: deleteTeacher,
    student: deleteStudent,
    exam: deleteExam,
    // TODO: OTHER DELETE ACTIONS
    parent: deleteParent,
    lesson: deleteSubject,
    assignment: deleteAssignment,
    result: deleteSubject,
    attendance: deleteSubject,
    event: deleteEvent,
    announcements: deleteSubject,
};


// load and then show form
const TeacherForm = dynamic(() => import("./forms/TeacherForm"));
const StudentForm = dynamic(() => import("./forms/StudentForm"));
const ParentForm = dynamic(() => import("./forms/ParentForm"));
const SubjectForm = dynamic(() => import("./forms/SubjectForm"));
const ClassForm = dynamic(() => import("./forms/ClassForm"));
const LessonForm = dynamic(() => import("./forms/LessonForm"));
const ExamForm = dynamic(() => import("./forms/ExamForm"));
const EventForm = dynamic(() => import("./forms/EventForm"));
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"));

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any,
        relatedData?: any,
    ) => JSX.Element;
} = {
    subject: (setOpen, type, data, relatedData) => (
        <SubjectForm
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
        />
    ),
    class: (setOpen, type, data, relatedData) => (
      <ClassForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    lesson: (setOpen, type, data, relatedData) => (
      <LessonForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    teacher: (setOpen, type, data, relatedData) => (
      <TeacherForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    student: (setOpen, type, data, relatedData) => (
      <StudentForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    parent: (setOpen, type, data, relatedData) => (
        <ParentForm
          type={type}
          data={data}
          setOpen={setOpen}
          relatedData={relatedData}
        />
      ),
    exam: (setOpen, type, data, relatedData) => (
      <ExamForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    assignment: (setOpen, type, data, relatedData) => (
      <AssignmentForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    // TODO OTHER LIST ITEMS
    event: (setOpen, type, data, relatedData) => (
      <EventForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
    announcements: (setOpen, type, data, relatedData) => (
      <AnnouncementForm
        type={type}
        data={data}
        setOpen={setOpen}
        relatedData={relatedData}
      />
    ),
};
/* 
  const [open, setOpen] = useState(false);
  // niche ka used upar
  {
    table: "teacher" | "student"
    | "parent" | "subject" | "class" |
    "lesson" | "exam" | "assignment"
    | "result" | "attendance" | "event"
    | "announcements";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: string | number;
    color?: string;
})
*/
const FormModel = ({
    table,
    type,
    data, 
    id, 
    color, 
    relatedData,
}: FormContainerProps & { relatedData?: any }) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";

    //useState
    const [open, setOpen] = useState(false);
    // var resURL:string;
    // if(data){
    //     resURL = `/list/results/${data.id}`;
    // }
    // delete model
    const Form = () => {

        //deleting element of lists
        const [state, formAction] = useFormState(deleteActionMap[table], { success: false, error: false });

        const router = useRouter();
        useEffect(() => {
            if (state.success) {
                toast(`${table} has been deleted!`);
                setOpen(false);
                router.refresh();
            }
        }, [state, router]);
        return type === "delete" && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="string|number" name="id" value={id} hidden />
                <span className="text-center font-medium">Are You Sure to delete {table}? All data will be lost</span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center ">
                    Delete
                </button>
            </form>
        ) :type==="view"?(
            <div className="bg-white border-b flex w-full h-[400px ] justify-center items-center" > Loading...</div>
        )  
        //: type === "view" ? ()


            //     <div className="p-4 flex flex-col gap-4">
            //         <div className="text-xs text-center relative">
            //             St.Joseph&apos;s Senior Seceondary School

            //             <div className="absolute top-6 right-10 cursor-pointer rounded-full" onClick={() => setOpen(false)}>
            //                 {/* <a id="resid" href={resURL}> */}
            //                     <Image src="/print.png" alt="" width={20} height={20}></Image>
            //                 {/* </a> */}{/*
            //             </div>
            //         </div>
            //         <div className="text-xs text-center">
            //             Kodari, Barhalganj
            //         </div>
            //         <div className="flex justify-between p-4">
            //             <span className="font-medium">Student Name: {data.student}</span>
            //             <span className="font-medium">
            //                 {data.score >= 40 ?
            //                     <div className="text-green-500 font-bold">
            //                         Passed
            //                     </div>
            //                     : data.score >= 35 ?
            //                         <div className="text-zinc-500 font-bold">
            //                             Promoted
            //                         </div>
            //                         : <div className="text-red-500 font-bold">
            //                             Failed
            //                         </div>
            //                 }
            //             </span>
            //         </div>
            //         <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center ">
            //             {data.id}
            //         </button> */}
            //     </div>
            //     */
            : type === "create" || type === "update" ? (
                forms[table](setOpen, type, data, relatedData)
            ) : (
                "Form not found"
            );
    };
    return (
        <>
            <button className={`${size} flex items-center justify-center rounded-full ${color}`} onClick={() => setOpen(true)}>
                <Image src={`/${type}.png`} alt="" width={16} height={16} />
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


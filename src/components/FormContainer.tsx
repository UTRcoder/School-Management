import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import FormModel from "./FormModel";

export type FormContainerProps = {
    table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcements";
    type: "create" | "update" | "delete" | "view";
    data?: any;
    id?: number | string;
    color: string
};

const FormContainer = async ({ table, type, data, id, color }: FormContainerProps) => {
    let relatedData = {};
    // console.log(data); // all things are undefined here!!
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId;

    if (type !== "delete") {
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: subjectTeachers };
                break;

            case "class":
                const classGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: classTeachers, grades: classGrades };
                break;
            case "lesson":
                const lessonSubject = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                const lessonClass = await prisma.class.findMany({
                    include: { _count: { select: { students: true } } },
                });
                const lessonTeacher = await prisma.teacher.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { subject: lessonSubject, class: lessonClass, teacher: lessonTeacher };
                break;
            case "teacher":
                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { subjects: teacherSubjects };
                break;
            case "student":
                const studentGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const studentClasses = await prisma.class.findMany({
                    include: { _count: { select: { students: true } } },
                });
                relatedData = { grades: studentGrades, classes: studentClasses };
                break;
            case "parent":
                const parentStudents = await prisma.student.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { subjects: parentStudents };
                break;
            case "exam":
                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: examLessons };
                break;
            case "assignment":
                const assignmentLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: assignmentLessons };
                break;
            case "event":
                const eventClasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { classes: eventClasses };
                break;
            case "announcements":
                const announcementClassess = await prisma.class.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { classes: announcementClassess };
                break;

            default:
                break;

        }
    }
    //checking the data here before passing is good.

    return (
        <div className="">
            <FormModel
                table={table}
                type={type}
                data={data}
                id={id}
                color={color}
                relatedData={relatedData}
            />
        </div>
    );
};

export default FormContainer;
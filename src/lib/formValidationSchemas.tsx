import { literal, z } from "zod";

export const subjectSchema = z.object({
  // uae .coerce to prevent returning string in primitive type where number is asked form id;
  id: z.coerce.number().optional(),
  name: z.string().min(3, { message: "Subject name of atleast 3 words is REQUIRED!" }),
  teachers: z.array(z.string()), //teacher ids
});
export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  // uae .coerce to prevent returning string in primitive type where number is asked form id;
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
});
export type ClassSchema = z.infer<typeof classSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject Name is required!" }),
  day: z.enum(["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"], { message: "Day is required!" }),
  startTime: z.coerce.date({ message: "Start Time info is Required" }),
  endTime: z.coerce.date({ message: "End Time info is Required" }),
  subjectId: z.coerce.number().min(1, { message: "Subject is Required!" }),
  classId: z.coerce.number().min(1, { message: "Class is Required!" }),
  teacherId: z.string().min(1, { message: "Teacher is Required!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters Required" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters Required" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is Required!" }),
  classId: z.coerce.number().min(1, { message: "Class is Required!" }),
  parentId: z.string().min(1, { message: "ParentId is Required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters Required" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string(),
  address: z.string(),
  students: z.array(z.string()).optional(), // subject ids
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const examSchema = z.object({
  // uae .coerce to prevent returning string in primitive type where number is asked form id;
  id: z.coerce.number().optional(),
  title: z.string().min(3, { message: "Title is REQUIRED!" }),
  startTime: z.coerce.date({ message: "Start Time info is Required" }),
  endTime: z.coerce.date({ message: "End Time info is Required" }),
  lessonId: z.coerce.number({ message: "Lesson is Required" })
});
export type ExamSchema = z.infer<typeof examSchema>;


export const assignmentSchema = z.object({
  // uae .coerce to prevent returning string in primitive type where number is asked form id;
  id: z.coerce.number().optional(),
  title: z.string().min(3, { message: "Title is REQUIRED!" }),
  startDate: z.coerce.date({ message: "Start Time info is Required" }),
  dueDate: z.coerce.date({ message: "End Time info is Required" }),
  lessonId: z.coerce.number({ message: "Lesson is Required" }),
});
export type AssignmentSchema = z.infer<typeof assignmentSchema>;


export const eventSchema = z.object({
  // uae .coerce to prevent returning string in primitive type where number is asked form id;
  id: z.coerce.number().optional(),
  title: z.string({ message: "Title is REQUIRED!" }),
  description: z.coerce.string().min(5, { message: "Describe Minimum five letters" }),
  startTime: z.coerce.date({ message: "Start Time info is Required" }),
  endTime: z.coerce.date({ message: "End Time info is Required" }),
  classId: z.coerce.number().optional().or(literal("")),
});
export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  // uae .coerce to prevent returning string in primitive type where number is asked form id;
  id: z.coerce.number().optional(),
  title: z.string({ message: "Title is REQUIRED!" }),
  description: z.coerce.string().min(5, { message: "Describe Minimum five letters" }),
  date: z.coerce.date({ message: "Date is Required" }),
  classId: z.coerce.number().optional().or(literal("")),
});
export type AnnouncementSchema = z.infer<typeof announcementSchema>;
import {
  admins,
  students,
  courses,
  questions,
  testAttempts,
  testAnswers,
  type Admin,
  type InsertAdmin,
  type Student,
  type InsertStudent,
  type Course,
  type InsertCourse,
  type Question,
  type InsertQuestion,
  type TestAttempt,
  type InsertTestAttempt,
  type TestAnswer,
  type InsertTestAnswer,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Admin operations
  getAdminByAdminId(adminId: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  authenticateAdmin(adminId: string, password: string): Promise<Admin | null>;
  
  // Student operations
  getStudentById(id: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  authenticateStudent(email: string, password: string): Promise<Student | null>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  
  // Question operations
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestionsByCourse(courseId: string): Promise<Question[]>;
  getAllQuestions(): Promise<(Question & { courseName: string })[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question>;
  deleteQuestion(id: string): Promise<void>;
  
  // Test operations
  createTestAttempt(testAttempt: InsertTestAttempt): Promise<TestAttempt>;
  getTestAttempt(id: string): Promise<TestAttempt | undefined>;
  updateTestAttempt(id: string, updates: Partial<TestAttempt>): Promise<TestAttempt>;
  getStudentTestHistory(studentId: string): Promise<(TestAttempt & { courseName: string })[]>;
  
  // Test answer operations
  saveTestAnswer(answer: InsertTestAnswer): Promise<TestAnswer>;
  getTestAnswers(testAttemptId: string): Promise<(TestAnswer & { questionText: string, correctAnswer: string })[]>;
  
  // Analytics
  getAdminStats(): Promise<{
    totalStudents: number;
    totalQuestions: number;
    testsToday: number;
    averageScore: number;
  }>;
  getAllStudentResults(): Promise<Array<{
    studentId: string;
    studentName: string;
    email: string;
    courseName: string;
    score: number;
    attempts: number;
    lastTest: Date;
  }>>;
  getRecentActivity(): Promise<Array<{
    studentName: string;
    courseName: string;
    score: number;
    completedAt: Date;
  }>>;
}

export class DatabaseStorage implements IStorage {
  async getAdminByAdminId(adminId: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.adminId, adminId));
    return admin;
  }

  async createAdmin(adminData: InsertAdmin): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const [admin] = await db
      .insert(admins)
      .values({ ...adminData, password: hashedPassword })
      .returning();
    return admin;
  }

  async authenticateAdmin(adminId: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByAdminId(adminId);
    if (!admin) return null;
    
    const isValid = await bcrypt.compare(password, admin.password);
    return isValid ? admin : null;
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.email, email));
    return student;
  }

  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.studentId, studentId));
    return student;
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const hashedPassword = await bcrypt.hash(studentData.password, 10);
    const [student] = await db
      .insert(students)
      .values({ ...studentData, password: hashedPassword })
      .returning();
    return student;
  }

  async authenticateStudent(email: string, password: string): Promise<Student | null> {
    const student = await this.getStudentByEmail(email);
    if (!student) return null;
    
    const isValid = await bcrypt.compare(password, student.password);
    return isValid ? student : null;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true));
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async updateCourse(id: string, courseData: Partial<InsertCourse>): Promise<Course> {
    const [course] = await db
      .update(courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.update(courses).set({ isActive: false }).where(eq(courses.id, id));
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question;
  }

  async getQuestionsByCourse(courseId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.courseId, courseId));
  }

  async getAllQuestions(): Promise<(Question & { courseName: string })[]> {
    return await db
      .select({
        id: questions.id,
        courseId: questions.courseId,
        questionText: questions.questionText,
        optionA: questions.optionA,
        optionB: questions.optionB,
        optionC: questions.optionC,
        optionD: questions.optionD,
        correctAnswer: questions.correctAnswer,
        difficulty: questions.difficulty,
        createdAt: questions.createdAt,
        updatedAt: questions.updatedAt,
        courseName: courses.name,
      })
      .from(questions)
      .innerJoin(courses, eq(questions.courseId, courses.id));
  }

  async createQuestion(questionData: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(questionData).returning();
    return question;
  }

  async updateQuestion(id: string, questionData: Partial<InsertQuestion>): Promise<Question> {
    const [question] = await db
      .update(questions)
      .set({ ...questionData, updatedAt: new Date() })
      .where(eq(questions.id, id))
      .returning();
    return question;
  }

  async deleteQuestion(id: string): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }

  async createTestAttempt(testAttemptData: InsertTestAttempt): Promise<TestAttempt> {
    const [testAttempt] = await db.insert(testAttempts).values(testAttemptData).returning();
    return testAttempt;
  }

  async getTestAttempt(id: string): Promise<TestAttempt | undefined> {
    const [testAttempt] = await db.select().from(testAttempts).where(eq(testAttempts.id, id));
    return testAttempt;
  }

  async updateTestAttempt(id: string, updates: Partial<TestAttempt>): Promise<TestAttempt> {
    const [testAttempt] = await db
      .update(testAttempts)
      .set(updates)
      .where(eq(testAttempts.id, id))
      .returning();
    return testAttempt;
  }

  async getStudentTestHistory(studentId: string): Promise<(TestAttempt & { courseName: string })[]> {
    return await db
      .select({
        id: testAttempts.id,
        studentId: testAttempts.studentId,
        courseId: testAttempts.courseId,
        startedAt: testAttempts.startedAt,
        completedAt: testAttempts.completedAt,
        score: testAttempts.score,
        totalQuestions: testAttempts.totalQuestions,
        correctAnswers: testAttempts.correctAnswers,
        timeSpent: testAttempts.timeSpent,
        isCompleted: testAttempts.isCompleted,
        courseName: courses.name,
      })
      .from(testAttempts)
      .innerJoin(courses, eq(testAttempts.courseId, courses.id))
      .where(and(eq(testAttempts.studentId, studentId), eq(testAttempts.isCompleted, true)))
      .orderBy(desc(testAttempts.completedAt));
  }

  async saveTestAnswer(answerData: InsertTestAnswer): Promise<TestAnswer> {
    const [answer] = await db.insert(testAnswers).values(answerData).returning();
    return answer;
  }

  async getTestAnswers(testAttemptId: string): Promise<(TestAnswer & { questionText: string, correctAnswer: string })[]> {
    return await db
      .select({
        id: testAnswers.id,
        testAttemptId: testAnswers.testAttemptId,
        questionId: testAnswers.questionId,
        selectedAnswer: testAnswers.selectedAnswer,
        isCorrect: testAnswers.isCorrect,
        timeSpent: testAnswers.timeSpent,
        questionText: questions.questionText,
        correctAnswer: questions.correctAnswer,
      })
      .from(testAnswers)
      .innerJoin(questions, eq(testAnswers.questionId, questions.id))
      .where(eq(testAnswers.testAttemptId, testAttemptId));
  }

  async getAdminStats(): Promise<{
    totalStudents: number;
    totalQuestions: number;
    testsToday: number;
    averageScore: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(students);
    const [questionCount] = await db.select({ count: sql<number>`count(*)` }).from(questions);
    const [testsToday] = await db
      .select({ count: sql<number>`count(*)` })
      .from(testAttempts)
      .where(and(
        eq(testAttempts.isCompleted, true),
        sql`${testAttempts.completedAt} >= ${today}`
      ));
    const [avgScore] = await db
      .select({ avg: sql<number>`avg(${testAttempts.score})` })
      .from(testAttempts)
      .where(eq(testAttempts.isCompleted, true));

    return {
      totalStudents: studentCount.count,
      totalQuestions: questionCount.count,
      testsToday: testsToday.count,
      averageScore: Number(avgScore.avg) || 0,
    };
  }

  async getAllStudentResults(): Promise<Array<{
    studentId: string;
    studentName: string;
    email: string;
    courseName: string;
    score: number;
    attempts: number;
    lastTest: Date;
  }>> {
    return await db
      .select({
        studentId: students.studentId,
        studentName: sql<string>`${students.firstName} || ' ' || ${students.lastName}`,
        email: students.email,
        courseName: courses.name,
        score: sql<number>`max(${testAttempts.score})`,
        attempts: sql<number>`count(${testAttempts.id})`,
        lastTest: sql<Date>`max(${testAttempts.completedAt})`,
      })
      .from(testAttempts)
      .innerJoin(students, eq(testAttempts.studentId, students.id))
      .innerJoin(courses, eq(testAttempts.courseId, courses.id))
      .where(eq(testAttempts.isCompleted, true))
      .groupBy(students.id, courses.id, students.studentId, students.firstName, students.lastName, students.email, courses.name);
  }

  async getRecentActivity(): Promise<Array<{
    studentName: string;
    courseName: string;
    score: number;
    completedAt: Date;
  }>> {
    return await db
      .select({
        studentName: sql<string>`${students.firstName} || ' ' || ${students.lastName}`,
        courseName: courses.name,
        score: sql<number>`COALESCE(${testAttempts.score}, 0)`,
        completedAt: sql<Date>`COALESCE(${testAttempts.completedAt}, NOW())`,
      })
      .from(testAttempts)
      .innerJoin(students, eq(testAttempts.studentId, students.id))
      .innerJoin(courses, eq(testAttempts.courseId, courses.id))
      .where(eq(testAttempts.isCompleted, true))
      .orderBy(desc(testAttempts.completedAt))
      .limit(10);
  }
}

export const storage = new DatabaseStorage();

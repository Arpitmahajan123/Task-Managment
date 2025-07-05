import { tasks, users, type User, type InsertUser, type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<UpdateTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTaskStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Task methods (updated for non-authenticated mode)
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks)
      .orderBy(tasks.createdAt);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks)
      .where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({ ...taskData, userId: 1 }) // Default user ID for non-authenticated mode
      .returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<UpdateTask>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  }> {
    const allTasks = await db.select().from(tasks);
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.completed).length;
    const pending = allTasks.filter(task => !task.completed).length;
    
    const now = new Date();
    const overdue = allTasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length;

    return {
      total,
      completed,
      pending,
      overdue,
    };
  }
}

// Use MemStorage for now, will switch to MongoDB later
class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private tasks: Map<number, Task> = new Map();
  private nextUserId = 1;
  private nextTaskId = 1;

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = Array.from(this.users.values());
    return users.find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user: User = {
      id: this.nextUserId++,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    const allTasks = Array.from(this.tasks.values());
    return allTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const task: Task = {
      id: this.nextTaskId++,
      title: taskData.title,
      description: taskData.description || null,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: taskData.completed || false,
      userId: 1, // Default user ID for non-authenticated mode
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<UpdateTask>): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;
    
    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const task = await this.getTask(id);
    if (!task) return false;
    
    return this.tasks.delete(id);
  }

  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  }> {
    const allTasks = await this.getTasks();
    const now = new Date();
    
    const stats = {
      total: allTasks.length,
      completed: allTasks.filter(t => t.completed).length,
      pending: allTasks.filter(t => !t.completed).length,
      overdue: allTasks.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate) < now
      ).length,
    };
    
    return stats;
  }
}

export const storage = new MemStorage();

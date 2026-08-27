import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_board_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// GET all tasks
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, status = 'todo' } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Parameterized SQL Query
    const [result]: any = await pool.query(
      'INSERT INTO tasks (title, status) VALUES (?, ?)',
      [title.trim(), status]
    );

    return NextResponse.json(
      { id: result.insertId, title: title.trim(), status },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
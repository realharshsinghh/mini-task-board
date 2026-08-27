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

// PATCH: Update task status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validation
    if (!status || !['todo', 'in-progress', 'done'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    // Parameterized SQL Query (SQL Injection Safe)
    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}


// DELETE task by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Parameterized SQL Query
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
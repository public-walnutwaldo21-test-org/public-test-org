"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);

  // BUG 1: Missing dependency array causes infinite re-renders
  useEffect(() => {
    setCount(count + 1);
  });

  // BUG 2: Fetching data without cleanup, potential memory leak
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // BUG 3: Direct state mutation instead of creating new array
  const addTask = () => {
    if (newTask.trim()) {
      tasks.push({
        id: tasks.length,
        title: newTask,
        completed: false,
      });
      setTasks(tasks);
      setNewTask("");
    }
  };

  // BUG 4: Using index as key and mutating state directly
  const toggleTask = (index: number) => {
    tasks[index].completed = !tasks[index].completed;
    setTasks([...tasks]);
  };

  // BUG 5: Wrong comparison operator (assignment instead of comparison)
  const getCompletedCount = () => {
    return tasks.filter((task) => (task.completed = true)).length;
  };

  // BUG 6: Memory leak - interval never cleared
  useEffect(() => {
    setInterval(() => {
      console.log("Timer tick");
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          Buggy Task Manager
        </h1>

        {/* Counter section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Render Counter</h2>
          <p className="text-gray-600">
            This component has rendered {count} times
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Increment
          </button>
        </div>

        {/* Task input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Tasks ({getCompletedCount()} completed)
          </h2>
          {/* BUG 7: Using index as key */}
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 p-3 rounded ${
                  task.completed ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="w-5 h-5"
                />
                <span
                  className={task.completed ? "line-through text-gray-400" : ""}
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Users list */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Users from API</h2>
          {/* BUG 8: Missing key prop */}
          <div className="grid grid-cols-2 gap-4">
            {users.map((user: any) => (
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="flex gap-4">
            <Link
              href="/about"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              About Page
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

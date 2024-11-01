"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import api from "@/components/utils/api";
import { Task } from "@/components/utils/types";

const TaskPage = () => {
  const { listId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskContent, setTaskContent] = useState<string>("");
  const [shareWith, setShareWith] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [listOwner, setListOwner] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/tasks/${listId}`);
        setTasks(response.data.tasks);
        setListOwner(response.data.owner.username);
      } catch (error) {
        console.log("Failed to fetch the list or you do not have access");
      }
    };

    fetchTasks();
  }, [listId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(`/tasks/${listId}`, {
        content: taskContent,
      });
      setTasks([...tasks, response.data]);
      setTaskContent("");
    } catch (error) {
      console.log("Failed to add task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${listId}/${taskId}`);
      setTasks(tasks.filter((task: any) => task._id !== taskId));
    } catch (error) {
      console.log("Failed to delete task");
    }
  };

  const handleEditTask = async (taskId: string) => {
    const newContent = prompt("Enter new content for the task:");
    try {
      const response = await api.put(`/tasks/${listId}/${taskId}`, {
        content: newContent,
      });
      const updatedTask = response.data;
      setTasks(
        tasks.map((task: Task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.log("Failed to update task");
    }
  };

  const handleShareList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/lists/${listId}/share`, {
        username: shareWith,
      });
      setSuccessMessage("List shared successfully!");
      setShareWith("");
    } catch (error) {
      console.log("Failed to share list");
    }
  };

  return (
    <div>
      <p>List owned by: {listOwner}</p>

      <ul className="list-page">
        {!!tasks.length ? (
          tasks.map((task: Task) => (
            <li key={task._id} className="list-item">
              <p>Content: {task.content}</p>
              <p>Created: {task.createdBy.username}</p>
              <p>
                Updated: {new Date(task.updatedAt).toLocaleDateString()}, &nbsp;
                {task.updatedBy.username}
              </p>

              <button onClick={() => handleEditTask(task._id)}>Edit</button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>There is no tasks yet...</p>
        )}
      </ul>

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          placeholder="New task"
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <h2>Share this List</h2>
      <form onSubmit={handleShareList}>
        <input
          type="text"
          value={shareWith}
          onChange={(e) => setShareWith(e.target.value)}
          placeholder="Username to share with"
          required
        />
        <button type="submit">Share List</button>
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

export default TaskPage;

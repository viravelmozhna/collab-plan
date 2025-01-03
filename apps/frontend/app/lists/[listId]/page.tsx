"use client";

import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";

import Task from "@/components/task";
import { SocketContext } from "@/context/socket-provider";
import api from "@/utils/api";
import { TaskItem } from "@/utils/types";

const TaskPage = () => {
  const { listId } = useParams();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskContent, setTaskContent] = useState<string>("");
  const [shareWith, setShareWith] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [listOwner, setListOwner] = useState("");

  const socket = useContext(SocketContext);

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

  useEffect(() => {
    if (!socket) return; // Wait for the socket to initialize

    socket.emit("joinRoom", listId);

    socket.on("taskCreated", (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on("taskDescriptionUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on("taskCompletionUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    return () => {
      socket.emit("leaveRoom", listId);
      socket.off("taskCreated");
      socket.off("taskDescriptionUpdated");
      socket.off("taskCompletionUpdated");
      socket.off("taskDeleted");
    };
  }, [socket, listId]);

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
        tasks.map((task: TaskItem) =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.log("Failed to update task");
    }
  };

  const handleCompleteTask = async (taskId: string, complete: boolean) => {
    try {
      const response = await api.put(`/tasks/${listId}/${taskId}/complete`, {
        completed: complete,
      });
      const updatedTask = response.data;
      setTasks(
        tasks.map((task: TaskItem) =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.log(`Failed to ${complete ? "complete" : "reactivate"} task`);
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
    <>
      {!!tasks.length ? (
        <ul className="list-grid">
          {tasks.map((task: TaskItem) => (
            <Task
              key={`task_${task._id}`}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
            />
          ))}
        </ul>
      ) : (
        <p>There is no tasks yet...</p>
      )}

      <p>List owned by: {listOwner}</p>

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
    </>
  );
};

export default TaskPage;

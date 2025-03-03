"use client";
import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import Task from "@/components/task";
import { SocketContext } from "@/context/socket-provider";
import api from "@/utils/api";
import { TaskItem } from "@/utils/types";
import { NotificationContext } from "@/context/notification-context";
import Loader from "@/components/loader";

const TaskPage = () => {
  const { listId } = useParams();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskContent, setTaskContent] = useState<string>("");
  const [shareWith, setShareWith] = useState("");
  const [listOwner, setListOwner] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const socket = useContext(SocketContext);
  const notification = useContext(NotificationContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/tasks/${listId}`);
        setTasks(response.data.tasks);
        setListOwner(response.data.owner.username);
      } catch (error) {
        notification?.updateNotification(
          "Failed to fetch the tasks or you do not have access",
          "error"
        );
        console.log(error);
      } finally {
        setIsLoading(false);
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
      notification?.updateNotification("Task added successfully!", "success");
    } catch (error) {
      notification?.updateNotification("Failed to add task", "error");
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${listId}/${taskId}`);
      setTasks(tasks.filter((task: any) => task._id !== taskId));
      notification?.updateNotification("Task deleted successfully!", "success");
    } catch (error) {
      notification?.updateNotification("Failed to delete task", "error");
      console.log(error);
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
      notification?.updateNotification("Task updated successfully!", "success");
    } catch (error) {
      notification?.updateNotification("Failed to update task", "error");
      console.log(error);
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
      notification?.updateNotification(
        `Task ${complete ? "completed" : "reactivated"} successfully!`,
        "success"
      );
    } catch (error) {
      notification?.updateNotification(
        `Failed to ${complete ? "complete" : "reactivate"} task`,
        "error"
      );
      console.log(error);
    }
  };

  const handleShareList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/lists/${listId}/share`, {
        username: shareWith,
      });
      setShareWith("");
      notification?.updateNotification("List shared successfully!", "success");
    } catch (error) {
      notification?.updateNotification("Failed to share list", "error");
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="grid grid-cols-4 gap-12">
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
      )}

      {!tasks.length && !isLoading && <p>There is no tasks yet...</p>}

      {!!tasks.length && !isLoading && (
        <p className="mt-12">List owned by: {listOwner}</p>
      )}

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

      <form onSubmit={handleShareList}>
        <input
          type="text"
          value={shareWith}
          onChange={(e) => setShareWith(e.target.value)}
          placeholder="Username to share with"
          required
        />
        <button type="submit">Share List</button>
      </form>
    </>
  );
};

export default TaskPage;

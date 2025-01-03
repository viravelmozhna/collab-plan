import { Delete02Icon } from "hugeicons-react";
import { PencilEdit02Icon } from "hugeicons-react";
import { CheckmarkCircle01Icon } from "hugeicons-react";
import { RepeatIcon } from "hugeicons-react";
import ItemCard from "./itemCard";
import { TaskItem } from "@/utils/types";

type Props = {
  task: TaskItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, complete: boolean) => void;
};

export default function Task({ task, onEdit, onDelete, onComplete }: Props) {
  return (
    <ItemCard
      id={task._id}
      classNames={`item task-item ${task.completed && "completed-task"}`}
    >
      <div className="action-icons">
        {task.completed ? (
          <div onClick={() => onComplete(task._id, false)}>
            <RepeatIcon size={18} />
          </div>
        ) : (
          <>
            <div onClick={() => onDelete(task._id)}>
              <Delete02Icon size={18} />
            </div>
            <div onClick={() => onEdit(task._id)}>
              <PencilEdit02Icon size={19} />
            </div>
            <div onClick={() => onComplete(task._id, true)}>
              <CheckmarkCircle01Icon size={18} />
            </div>
          </>
        )}
      </div>

      <div className="content">{task.content}</div>

      <div className="details">
        <span>Created: {task.createdBy.username}</span>
        <br />
        <span>{`${task.completed ? "Completed" : "Updated"}: ${
          task.updatedBy.username
        }, ${new Date(task.updatedAt).toLocaleDateString()}`}</span>
      </div>
    </ItemCard>
  );
}

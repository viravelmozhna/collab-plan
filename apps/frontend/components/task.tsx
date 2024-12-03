import { Delete02Icon } from "hugeicons-react";
import { PencilEdit02Icon } from "hugeicons-react";
import { CheckmarkCircle01Icon } from "hugeicons-react";
import { RepeatIcon } from "hugeicons-react";

import { Task as TaskType } from "@/utils/types";
import ItemCard from "./itemCard";
import itemCard from "./itemCard.module.css";

type Props = {
  task: TaskType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string, complete: boolean) => void;
};

export default function Task({ task, onEdit, onDelete, onComplete }: Props) {
  return (
    <ItemCard
      id={task._id}
      classNames={`${itemCard["list-item"]} ${itemCard["task-item"]} ${
        task.completed ? itemCard["completed"] : ""
      }`}
    >
      <div className={itemCard["action-icons"]}>
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

      <p className={itemCard["content"]}>{task.content}</p>

      <p className={itemCard["details"]}>Created: {task.createdBy.username}</p>
      <p className={itemCard["details"]}>
        <span>{task.completed ? "Completed" : "Updated"}</span>:{" "}
        {new Date(task.updatedAt).toLocaleDateString()}, &nbsp;
        {task.updatedBy.username}
      </p>
    </ItemCard>
  );
}

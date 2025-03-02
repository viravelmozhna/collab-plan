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
      classNames={`flex flex-col p-12 cursor-default shadow-md ${
        task.completed ? "bg-greyish" : "bg-white"
      }`}
    >
      <div className="action-icons flex gap-4">
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

      <div
        className={`mb-4 text-lg ${
          task.completed ? "text-greyish-2 line-through" : ""
        }`}
      >
        {task.content}
      </div>

      <div className="text-greyish-2 text-xs">
        <span>Created: {task.createdBy.username}</span>
        <br />
        <span>{`${task.completed ? "Completed" : "Updated"}: ${
          task.updatedBy.username
        }, ${new Date(task.updatedAt).toLocaleDateString()}`}</span>
      </div>
    </ItemCard>
  );
}

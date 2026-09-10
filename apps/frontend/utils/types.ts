export type User = {
  _id: string;
  username: string;
};

export type TaskItem = {
  _id: string;
  content: string;
  completed: boolean;
  list: string;
  owner: string;
  createdBy: User;
  updatedBy: User;
  updatedAt: string;
};

export type List = {
  _id: string;
  name: string;
  owner: string;
  sharedWith: User[];
  tasks: TaskItem[];
  isOwner: boolean;
};

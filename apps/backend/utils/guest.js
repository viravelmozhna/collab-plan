import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

import User from "../models/user.js";
import List from "../models/list.js";
import Task from "../models/task.js";

// Guest accounts exist so the app can be tried without signing up. They are
// disposable: every visitor gets their own, and stale ones are removed so the
// free database tier does not fill up with them.
const GUEST_TTL_DAYS = 7;
const GUEST_TTL_MS = GUEST_TTL_DAYS * 24 * 60 * 60 * 1000;

const SAMPLE_LIST_NAME = "Welcome to Plan Together";
const SAMPLE_TASKS = [
  { content: "Open this list in a second window to see live updates", completed: false },
  { content: "Add a task, edit it, tick it off", completed: false },
  { content: "Share a list with another user by their username", completed: false },
  { content: "This one is already done", completed: true },
];

export const createGuestUser = async () => {
  // bcrypt still hashes a real password even though nobody is told it: the
  // account should be no more loggable-into than any other.
  const username = `guest_${randomBytes(4).toString("hex")}`;
  const password = await bcrypt.hash(randomBytes(24).toString("hex"), 10);

  const user = new User({ username, password, isGuest: true });
  await user.save();
  return user;
};

export const seedGuestData = async (userId) => {
  const list = new List({ name: SAMPLE_LIST_NAME, owner: userId });
  await list.save();

  const tasks = await Task.insertMany(
    SAMPLE_TASKS.map((task) => ({
      ...task,
      list: list._id,
      owner: userId,
      createdBy: userId,
      updatedBy: userId,
    }))
  );

  list.tasks = tasks.map((task) => task._id);
  await list.save();

  return list;
};

// Removes guests older than the TTL along with everything they own. Called
// opportunistically when a new guest is created, which avoids needing a
// scheduler (Render's free tier has no cron jobs).
export const pruneExpiredGuests = async () => {
  const cutoff = new Date(Date.now() - GUEST_TTL_MS);
  const expired = await User.find({ isGuest: true, createdAt: { $lt: cutoff } })
    .select("_id")
    .lean();
  if (!expired.length) return 0;

  const userIds = expired.map((user) => user._id);
  const lists = await List.find({ owner: { $in: userIds } }).select("_id").lean();
  const listIds = lists.map((list) => list._id);

  await Task.deleteMany({ list: { $in: listIds } });
  await List.deleteMany({ _id: { $in: listIds } });
  // A guest may have been shared into someone else's list; drop the reference
  // rather than the list.
  await List.updateMany(
    { sharedWith: { $in: userIds } },
    { $pull: { sharedWith: { $in: userIds } } }
  );
  await User.deleteMany({ _id: { $in: userIds } });

  return userIds.length;
};

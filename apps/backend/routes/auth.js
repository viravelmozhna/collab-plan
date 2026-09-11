import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { ErrorMessage } from "../utils/constants.js";
import {
  createGuestUser,
  seedGuestData,
  pruneExpiredGuests,
} from "../utils/guest.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const duplicatedUser = await User.findOne({ username });
    if (duplicatedUser) {
      res.status(409).json({ error: ErrorMessage.dublicatedUser });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ error: ErrorMessage.usernameInvalid });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: ErrorMessage.passwordInvalid });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lets a visitor try the app without signing up. Each call creates its own
// throwaway account seeded with a sample list, so demo users cannot see or
// break each other's data.
router.post("/guest", async (req, res) => {
  try {
    // Best effort: a failure to tidy up old guests must not stop a new one.
    try {
      await pruneExpiredGuests();
    } catch (error) {
      console.log(`Guest pruning failed: ${error.message}`);
    }

    const user = await createGuestUser();
    await seedGuestData(user._id);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

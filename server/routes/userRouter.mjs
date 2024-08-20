import express from "express";
import { getDb } from "../db/conn.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDb().connection;
    const user = await db.collection("users").findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
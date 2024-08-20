import express from "express";
import { getDb } from "../db/conn.mjs";
import Test from "../models/Test.mjs";
import Question from "../models/question.mjs";
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const db = getDb().connection;
    const tests = await db.collection("tests").find().toArray();
    // console.log(tests);
    res.json({ tests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get test and its questions by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    var questions = await Question.find({ testId: id }).lean();
    return res.json({ test, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/create", async (req, res) => {
  const { title, questions } = req.body;

  try {
    // Create and save the Test document
    const test = new Test({ title });
    const savedTest = await test.save();

    // console.log(savedTest);

    // Create and save each Question document
    const questionPromises = questions.map((q) => {
      const question = new Question({
        title: q.title,
        options: q.options,
        correctOption: q.correctOption,
        point: q.point,
        testId: savedTest._id,
      });
    //   console.log(question);
      return question.save();
    });

    await Promise.all(questionPromises);

    res.status(201).send({ message: "Test created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "An error occurred while creating the test",
    });
  }
});

export default router;

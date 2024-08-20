import mongoose from "mongoose";
const Schema = mongoose.Schema;

const question = new Schema({
  title: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: String, required: true },
  point: { type: Number, required: true },
  testId: { type: Schema.Types.ObjectId, ref: "test" },
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("question", question);

export default Question;

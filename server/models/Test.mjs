import mongoose from "mongoose";
const Schema = mongoose.Schema;

const test = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Test = mongoose.model("test", test);

export default Test;

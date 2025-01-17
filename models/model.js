import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  id:{type:Number,required:true},
  title: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);

export default Task;

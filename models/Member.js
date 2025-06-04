import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const noteSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    present: { type: Boolean, required: true },
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    address: { type: String },
    joinDate: { type: String },
    lastAttendance: { type: String },
    lastContact: { type: String },
    assignedTo: { type: String },
    status: { type: String, enum: ["Active", "Inactive", "Needs Follow-up", "New"], default: "New" },
    notes: [noteSchema],
    attendanceHistory: [attendanceSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

memberSchema.plugin(toJSON);

export default mongoose.models.Member || mongoose.model("Member", memberSchema); 
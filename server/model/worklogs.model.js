import mongoose from "mongoose";
// Define a schema for the collection
export const assigneeSchema = new mongoose.Schema({
  assigneeEmail: String,
  assigneeName: String,
  issues: [{
    issueId: String,
    issueKey: String,
    summary: String,
    worklogs: [{ /* Define the worklogs schema if needed */ }],
  }],
});

// Create a model for the collection
//const Assignee = mongoose.model('Assignee', assigneeSchema);


// Create a model for the collection
const Assignee = mongoose.model('Assignee', assigneeSchema);

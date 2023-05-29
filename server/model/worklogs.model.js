import mongoose from "mongoose";

const worklogSchema = new mongoose.Schema({
  // Define the properties of a worklog
  // Adjust the schema according to the actual properties in your case
  author: {
    self: { type: String },
    accountId: { type: String },
    avatarUrls: { type: Object },
    displayName: { type: String },
    active: { type: Boolean },
    // ... add more properties as needed
  },
  comment: {
    content: { type: String },
    // ... add more properties as needed
  },
  type: { type: String },
  version: { type: Number },
  created: { type: Date },
  id: { type: String },
  issueId: { type: String },
  self: { type: String },
  started: { type: Date },
  timeSpent: { type: String },
  timeSpentSeconds: { type: Number },
  updateAuthor: {
    self: { type: String },
    accountId: { type: String },
    avatarUrls: { type: Object },
    displayName: { type: String },
    active: { type: Boolean },
    // ... add more properties as needed
  },
  updated: { type: Date },
});

const issueSchema = new mongoose.Schema({
  // Define the properties of an issue
  // Adjust the schema according to the actual properties in your case
  issueKey: { type: String, required: true },
  summary: { type: String, required: true },
  worklogs: [worklogSchema],
});

const AssigneeIssuesSchema = new mongoose.Schema({
  // Define the properties of an AssigneeIssues document
  // Adjust the schema according to the actual properties in your case
  assigneeEmail: { type: String, required: true },
  assigneeName: { type: String, required: true },
  issues: [issueSchema],
});

const AssigneeIssues = mongoose.model('AssigneeIssues', AssigneeIssuesSchema);

// Example usage to save assigneeIssues with worklogs to MongoDB

export default AssigneeIssues;
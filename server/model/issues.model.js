import mongoose from "mongoose";



const issueSchema = new mongoose.Schema({
    week:{
    startDate: String,
    endDate: String,
    },
    projectName: String,
    assigneeAccountId: String,
    displayName: String,
    email: String,
    issues: [
      {
        issueId: String,
        issueKey: String,
        summary: String,
        worklogs: [
          {
            created: String,
            updated: String,
            timeSpent: String,
            started: String,
          },
        ],
      },
    ],

  });

export default mongoose.model.Issue || mongoose.model('Issue', issueSchema);
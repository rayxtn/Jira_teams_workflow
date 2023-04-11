import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
    {
        issueid : String
    }
);
export default mongoose.model.Issues || mongoose.model('Issue', IssueSchema);
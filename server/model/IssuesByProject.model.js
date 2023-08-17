import mongoose from "mongoose";
const issuesByProjectSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    data: Object, // This should match your response data structure
  });
  export default mongoose.model.issuesByProject || mongoose.model('issuesByProject', issuesByProjectSchema);
import mongoose from "mongoose";
const shiftsByWeekSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    data: Object, // This should match your response data structure
  });
  export default mongoose.model.shiftsByWeek || mongoose.model('shiftsByWeek', shiftsByWeekSchema);
import mongoose from "mongoose";
const weekDataSchema = new mongoose.Schema({
    week: {
      type: String,
      required: true,
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  });
  
  const WeeksData = mongoose.model('WeeksData', weekDataSchema);
  
export default WeeksData;
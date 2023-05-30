import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  id: { type: String },
  displayName: { type: String },
  startDateTime: { type: Date },
  endDateTime: { type: Date },
  createdDateTime: { type: Date },
  lastModifiedDateTime: { type: Date },
  userId: { type: String},
  userDisplayName: { type: String },
  userEmailAddress: { type: String },
  userRole: { type: String },
  teamId: { type: String},
  teamDisplayName: { type: String},
  teamMemberCount: { type: Number }
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;

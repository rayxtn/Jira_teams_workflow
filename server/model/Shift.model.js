import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
      odataEtag: { type: String },
      id: { type: String },
      createdDateTime: { type: Date },
      lastModifiedDateTime: { type: Date },
      schedulingGroupId: { type: String },
      userId: { type: String },
      draftShift: { type: Object },
      lastModifiedBy: {
        application: { type: Object },
        device: { type: Object },
        user: {
          id: { type: String },
          displayName: { type: String },
          userIdentityType: { type: String },
        },
      },
      sharedShift: {
        displayName: { type: String },
        startDateTime: { type: Date },
        endDateTime: { type: Date },
        theme: { type: String },
        notes: { type: String },
        activities: { type: Array },
      },
    });

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;

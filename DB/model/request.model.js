import { model, Schema, Types } from "mongoose";
const requestSchema = new Schema(
  {
    students:{
      type:[{type: Types.ObjectId,ref:"student"}],
      required:false,
    },
    sectionId: {
      type: Types.ObjectId,
      ref: "department",
    },
    studentId: {
      type: Types.ObjectId,
      ref: "user",
    },
    state:{
      type:String,
      default:"Pending"
    }
   
    
  },
  { timestamps: true }
);
export const requestModel = model("request", requestSchema);

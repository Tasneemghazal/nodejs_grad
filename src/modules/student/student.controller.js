import { requestModel } from "../../../DB/model/request.model.js";
import { sectionModel } from "../../../DB/model/section.model.js";
import { submitModel } from "../../../DB/model/submit.model.js";
import { uploadFile } from "../../services/uploadFile.js";

export const bookSection = async (req, res, next) => {
    try {
     const {text,studentId,sectionId}=req.body;
     const request = await requestModel.create({text,studentId,sectionId});
     await sectionModel.findByIdAndUpdate(sectionId,{visible:false});
     return res.status(201).json({message:"success",request});
    } catch (err) {
      next(new Error(err.message, { cause: 500 }));
    }
  };

  export const getStudentSection = async (req, res, next) => {
    try {
      const section = await sectionModel.findOne({ students: req.userId });
  
      if (!section) {
        return res.status(404).json({ message: "Section not found for this student" });
      }
      return res.status(200).json({ section });
    } catch (err) {
      next(new Error(err.message, { cause: 500 }));
    }
  }
  export const submitTask = async (req, res, next) => {
    try {
        const { txt } = req.body;
        const {sectionId, taskId} = req.params;
        const fileTask = await uploadFile(req.file.path);
        const submission = await submitModel.create({
            txt,
            section: sectionId,
            taskId,
            file: fileTask
        });
        return res.status(201).json({ message: "Task submitted successfully", submission });
    } catch (err) {
        next(new Error(err.message, { cause: 500 }));
    }
};

  
  
  


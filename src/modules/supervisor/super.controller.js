import { requestModel } from "../../../DB/model/request.model.js";
import { sectionModel } from "../../../DB/model/section.model.js";
import { taskModel } from "../../../DB/model/task.model.js";
import { getUser } from "../../services/getId.js";
import { uploadFile } from "../../services/uploadFile.js";


export const reject = async (req, res, next) => {
  try {
    const request = await requestModel.findByIdAndUpdate(
      req.body.requestId,
      { state: "rejected" },
      { new: true }
    );
    await sectionModel.findByIdAndUpdate(req.body.sectionId, { visible: true });
    return res.status(201).json(request);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const confirm = async (req, res, next) => {
  try {
    const {  students } = req.body;
    const arr = [];
    for (let i = 0; i < students.length; i++) {
      const user = await getUser(students[i]);
      arr.push(user._id);
    }

    const request = await requestModel.findByIdAndUpdate(
      req.body.requestId,
      { state: "accept" },
      { new: true }
    );
    await sectionModel.findByIdAndUpdate(req.body.sectionId, { students: arr,visible: false });
    return res.status(201).json(request);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const getMySections = async (req, res, next) => {
  try {
    const section = await sectionModel.find({ userId: req.userId });
    return res.status(200).json(section);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const getSectionNum = async (req, res, next) => {
  try {
    const {id}=req.params;
    const section = await sectionModel.findById(id);
    return res.status(200).json(section.num);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const assignTask = async (req, res, next) => {
  try {
    const { txt, sections,startDate,endDate } = req.body;
    const supervisorId = req.userId;
    const fileTask = await uploadFile(req.file.path);
    const task = await taskModel.create({ txt, sections,startDate, endDate, file: fileTask,supervisor:supervisorId });
    return res.status(201).json({message:"success",task});
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const giveFeedback = async (req, res, next) => {
  try {
    const {  feedback } = req.body;
    const {id}=req.params
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.feedback = feedback;
    await task.save();
    return res.status(200).json({ message: "Feedback submitted successfully", feedback ,task });
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const supervisorRequests = async (req, res, next) => {
  try {
    const supervisorId = req.userId; 
    const sections = await sectionModel.find({ userId: supervisorId });
    const sectionIds = sections.map(section => section._id);
    const requests = await requestModel.find({ sectionId: { $in: sectionIds } });
                                    
    return res.status(200).json({ requests });
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};
export const getSupervisorTask = async (req, res, next) => {
  try {
    const supervisorId = req.userId;
    const tasks = await taskModel.find({ supervisor: supervisorId });
    return res.json({ tasks });
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};
export const getTaskById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const tasks = await taskModel.findById(id);
    return res.json({ message:"success",tasks });
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const updateTask = async (req, res, next) => {
  try{
    const {id}= req.params;
    const { txt, sections,startDate,endDate } = req.body;
    const supervisorId = req.userId;
    const fileTask = await uploadFile(req.file.path);
    const task = await taskModel.findByIdAndUpdate(id,{ txt, sections,startDate, endDate, file: fileTask,supervisor:supervisorId },{new:true});
    return res.status(201).json({message:"success",task});
  }catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};


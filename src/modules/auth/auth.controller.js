import { userModel } from "../../../DB/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { studentModel } from "../../../DB/model/student.model.js";
export const userSignUp = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, role, depId,officeHours} = req.body;
    const exitUser = await userModel.findOne({ email: email });
    if (exitUser) {
      return next(new Error("exist user", { cause: 500 }));
    }
    const hash = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
    let user = undefined;
    if (depId && officeHours) {
      user = await userModel.create({
        name,
        email,
        password: hash,
        phoneNumber,
        role,
        depId,
        officeHours
      });
    } else {
      user = await userModel.create({
        name,
        email,
        password: hash,
        phoneNumber,
        role,
      });
    }

    res.status(201).json({ message: "success", user });
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const studentSignUp = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber,depId,academicYear,universityNum} = req.body;
    const exitUser = await studentModel.findOne({ email: email });
    if (exitUser) {
      return next(new Error("exist user", { cause: 500 }));
    }
    const hash = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
    const user = await studentModel.create({
      name,
      email,
      password: hash,
      phoneNumber,
      depId,
      academicYear,
      universityNum
    });
    res.status(201).json({ message: "success", user });
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({
      email,
    });
    if (!user) {
      user = await studentModel.findOne({
        email: email,
      });
    }
    if (!user) {
      return next(new Error("invalid account", { cause: 404 }));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(
        new Error("invalid account error in password", { cause: 400 })
      );
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.LOGINTOKEN,
      {
        expiresIn: 60 * 60 * 24 * 7 ,
      }
    );
    return res.status(200).json({ message: "valid account", token, role: user.role });
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

// export const sendCode = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     let user = await studentModel.findOne({ email }).select("email role");
//     let supervisor = false;
//     if (!user) {
//       user = await userModel.findOne({ email }).select("email role");
//       supervisor = true;
//     }
//     if (!user) {
//       next(new Error("cant find user", { cause: 404 }));
//     } else {
//       const code = nanoid();
//       await sendEmail(email, "Forget password", `verify code : ${code}`);
//       if (supervisor) {
//         await userModel.findOneAndUpdate({ email }, { sendCode: code });
//       } else {
//         await userModel.findOneAndUpdate({ email }, { sendCode: code });
//       }

//       res.status(200).json({ message: "ok", role: user.role });
//     }
//   } catch (err) {
//     next(new Error(err.message, { cause: 500 }));
//   }
// };

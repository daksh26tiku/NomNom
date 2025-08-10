const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");
const User = require("../models/UserModel");
const Recipe = require("../models/RecipeModel");
const { SignJWT } = require("jose-node-cjs-runtime/jwt/sign");
const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET_KEY);

async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const signUpVerification = async (req, res) => {
  const { otp, firstName, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists!",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${otp} Culinary Art signup OTP`,
      html: `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Welcome to Culinary Art!</h2>
      <p>Hello ${firstName},</p>
      <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
      <div style="background: #fff4e6; padding: 20px; border-radius: 8px; margin-top: 20px; margin-bottom: 20px; text-align: center;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316;">${otp}</span>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Sorry, couldn't send the email! Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "A verification code has been sent to your Email. Please check.",
      });
    });

    // return res.send("Email Sending is currently paused");
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const forgetPassVerification = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "This account doesn't exist!",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${otp} Culinary Art reset password OTP`,
      html: `
    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">For updating your Culinary Art password</h2>
      <p>Hello ${existingUser.fullName.split(" ")[0]},</p>
      <p>Please use the following verification code to reset your account password:</p>
      <div style="background: #fff4e6; padding: 20px; border-radius: 8px; margin-top: 20px; margin-bottom: 20px; text-align: center;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316;">${otp}</span>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this action, please ignore this email.</p>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Sorry, couldn't send the email! Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "A verification code has been sent to your Email. Please check.",
      });
    });

    // return res.send("Email Sending is currently paused");
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// const multer = require("multer");
// const path = require("path");

// const User = require("../model/User");

// const beapistart = "http://localhost:5001";

// const feapistart = "http://localhost:5173";

// //GET USER DATA

// const getallusers = async (req, res) => {
//   try {
//     const users = await User.find({}, "-password");

//     res
//       .status(200)
//       .json({ success: true, message: "all users fetched", data: users });
//   } catch (error) {
//     res.status(404).json({ success: false, message: "Not Found" });
//   }
// };

const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const recipes = await Recipe.find({ createdBy: userId });

    // Calculate total likes from all user's recipes
    const totalLikes = recipes.reduce(
      (acc, recipe) => acc + (recipe.likesCount || 0),
      0
    );

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
      userRecipes: recipes,
      totalLikesReceived: totalLikes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getUserPublicInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const recipes = await Recipe.find({ createdBy: id });

    // Calculate total likes from all user's recipes
    const totalLikes = recipes.reduce(
      (acc, recipe) => acc + (recipe.likesCount || 0),
      0
    );

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
      userRecipes: recipes,
      totalLikesReceived: totalLikes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// const getmyuser = async (req, res) => {
//   const id = req.user.id;

//   try {
//     const user = await User.findById(id).select("-password");

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User fetched successfully",
//       data: user,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

// Create new user
const createUser = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.JWT_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    await newUser.save();

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600);
    const user = {
      id: newUser._id,
      role: newUser.role,
      email: newUser.email,
      fullName: newUser.fullName,
      imageUrl: newUser.imageUrl,
      bookmarks: newUser.bookmarks,
    };

    const sessionToken = await encrypt({ ...user, expiresAt });

    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: newUser,
      token: sessionToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// // Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Sorry, User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600);
    const userInfo = {
      id: user._id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      bookmarks: user.bookmarks,
    };

    const token = await encrypt({ ...userInfo, expiresAt });

    res.status(200).json({
      success: true,
      message: `Logged in as ${user.fullName.split(" ")[0]} successfully`,
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//  Verfication email
// const sendverifyemail = async (req, res) => {
//   console.log("Sending Verification Email");

//   const id = req.user.id;

//   try {
//     const user = await User.findById(id).select("-password");
//     if (!user) {
//       console.log("User not found");
//       return res.status(400).json({ success: false, message: "Invalid email" });
//     }

//     const verifytoken = jwt.sign(
//       { id: user._id, role: user.role },
//       "emailverify",
//       {
//         expiresIn: "24h",
//       }
//     );

//     const transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       auth: {
//         user: "zakary.sawayn78@ethereal.email",
//         pass: "qxVy48M8FjvqU6ABD9",
//       },
//     });

//     const mailOptions = {
//       from: "zakary.sawayn78@ethereal.email",
//       to: user.email,
//       subject: "Email Verification for Recipe",
//       text: `Step-1 of you recipe building experience is to get verified. Click below:
//       ${feapistart}/verify-email?token=${verifytoken}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return console.log(error);
//       }
//       console.log("Email sent: " + info.response);
//     });

//     res.json({ success: true, message: "Verification sent", user });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// const verifyemail = async (req, res) => {
//   console.log("VERIFYING");
//   const { token } = req.query;

//   if (!token) {
//     return res.status(400).send("Verification token is missing");
//   }

//   try {
//     const decoded = jwt.verify(token, "emailverify");
//     const id = decoded.id;

//     const user = await User.findById(id).select("-password");
//     if (!user) {
//       return res.status(400).send("User not found");
//     }

//     if (user.isVerified) {
//       return res.status(400).send("User already verified");
//     }

//     user.isVerified = true;

//     await user.save();

//     res.status(200).send("Email verified successfully");
//   } catch (error) {
//     res.status(400).send("Invalid or expired token");
//   }
// };

// // Forget password
// const sendforgeturl = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not found" });
//     }

//     const token = jwt.sign({ id: user._id }, "I_forgOt", { expiresIn: "1h" });

//     const transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       auth: {
//         user: "zakary.sawayn78@ethereal.email",
//         pass: "qxVy48M8FjvqU6ABD9",
//       },
//     });

//     const mailOptions = {
//       from: "zakary.sawayn78@ethereal.email",
//       to: user.email,
//       subject: "Password Reset Link",
//       text: `Click the following link to reset your password: ${feapistart}/forget-password?token=${token}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res
//           .status(500)
//           .json({ success: false, message: "Error sending email", error });
//       }
//       res
//         .status(200)
//         .json({ success: true, message: "Password reset link sent" });
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist. Please try again!",
      });
    }

    // console.log(user)

    const salt = await bcrypt.genSalt(Number(process.env.JWT_SALT_ROUNDS));
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600);
    const userInfo = {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      email: user.email,
      bookmarks: user.bookmarks,
    };

    const token = await encrypt({ ...userInfo, expiresAt });

    res.status(200).json({
      success: true,
      message: "Your account password has been updated successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Sorry, couldn't update your password. Please try again!",
    });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist. Please try again!",
      });
    }

    // console.log(user)

    const salt = await bcrypt.genSalt(Number(process.env.JWT_SALT_ROUNDS));
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600);
    const userInfo = {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      email: user.email,
    };

    const token = await encrypt({ ...userInfo, expiresAt });

    res.status(200).json({
      success: true,
      message: "Your account password has been updated successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Sorry, couldn't update your password. Please try again!",
    });
  }
};

// //Edit Users
const editUser = async (req, res) => {
  const { fullName, bio, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, bio, imageUrl },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600);
    const userInfo = {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      email: user.email,
      bookmarks: user.bookmarks,
    };
    const token = await encrypt({ ...userInfo, expiresAt });

    res.json({ success: true, message: "Profile updated successfully", token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
// //upload profile picture
// const PPstorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/profilepictures");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${req.user.id}${ext}`);
//   },
// });

// const PPupload = multer({
//   storage: PPstorage,
//   limits: { fileSize: 25 * 1024 * 1024 },
// });

// const uploadProfilepicture = async (req, res) => {
//   try {
//     const photoUrl = `/profilepictures/${req.file.filename}`;

//     await User.findByIdAndUpdate(req.user.id, { photo: photoUrl });

//     res.json({ success: true, photo: photoUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const deleteUser = async (req, res) => {
//   const { id } = req.body;

//   try {
//     const user = await User.findByIdAndDelete(id);

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

// const adeleteUser = async (req, res) => {
//   const deluserId = req.params.id;
//   const userId = req.user.id;

//   try {
//     const loggedInUser = await User.findById(userId);

//     if (!loggedInUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (loggedInUser.role !== "admin") {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const userToDelete = await User.findByIdAndDelete(deluserId);

//     if (!userToDelete) {
//       return res.status(404).json({ message: "User to delete not found" });
//     }

//     res.json({
//       success: true,
//       message: "User deleted successfully",
//       user: userToDelete,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

module.exports = {
  createUser,
  loginUser,
  signUpVerification,
  forgetPassVerification,
  resetPassword,
  getUser,
  editUser,
  updatePassword,
  getUserPublicInfo,
};
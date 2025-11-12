import { generateToken } from "../middleware/JWTHandler.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {io} from "../index.js"

export async function register(req, res, next) {
  try {
    console.log("register");
    const { nom, prenom, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      res.send("invalid");
      return console.log("email exist");
    }
    const hashPassword = await bcrypt.hash(password, 5);
 
    console.log(nom, prenom, email, hashPassword, role);
    if (
      await User.create({ nom, prenom, email, password: hashPassword, role })
    ) {
        io.emit("NewUser", newUser);
      return res.status(201).send({ message: "the user register" });
    }
  } catch (error) {
    next(error);
  }
}
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // récupérer tous les utilisateurs
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
 
};
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { nom, prenom, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { nom, prenom, email, role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUsersPaginated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();
    res.status(200).json({ users, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const dehashPassword = await bcrypt.compare(password, user.password); // Add await here
    if (dehashPassword) {
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      res.status(200).json({ message: "valid", token: token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

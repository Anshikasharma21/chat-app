import { generateToken } from "../lib/utlis.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup controller
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        // Check required fields
        if (!fullName || !email || !password || !bio) {
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "Account already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        // Generate token
        const token = generateToken(newUser._id);

        return res.json({
            success: true,
            userData: newUser,
            token,
            message: "Account created successfully"
        });

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        // Generate token
        const token = generateToken(userData._id);

        return res.json({
            success: true,
            userData,
            token,
            message: "Login successful"
        });

    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

//contrller to check if user is authicated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// controller to update user profile details

export const updateProfile = async (req, res) => {

    try {

        const { profilePic, bio, fullName } = req.body;

        let updatedUser;

        // If image exists
        if (profilePic) {

            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    profilePic: upload.secure_url,
                    bio,
                    fullName
                },
                { new: true }
            );

        } else {

            updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    bio,
                    fullName
                },
                { new: true }
            );
        }

        res.json({
            success: true,
            user: updatedUser
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io, userSocketMap} from "../server.js";

// Get all users except the logged in user
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessage = {};

    await Promise.all(
      users.map(async (user) => {
        const count = await Message.countDocuments({
          senderID: user._id,
          receiverID: userId,
          seen: false,
        });

        if (count > 0) {
          unseenMessage[user._id] = count;
        }
      })
    );

    res.json({
      success: true,
      users,
      unseenMessage,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Get all Message for selected user
export const getMessage = async (req, res) => {
    try {
        const { id: selectedUserID } = req.params;
        const myID = req.user._id;

        const message = await Message.find({
            $or: [
                { senderID: myID, receiverID: selectedUserID },
                { senderID: selectedUserID, receiverID: myID },
            ],
        });

        await Message.updateMany(
            { senderID: selectedUserID, receiverID: myID },
            { seen: true }
        );

        res.json({ success: true, message });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// api to mark message as seen using a message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;

        await Message.findByIdAndUpdate(id, { seen: true });

        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
// send message to selected user

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverID = req.params.id;
        const senderID = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderID,
            receiverID,
            text,
            image: imageUrl,
        });

       // Emit the new message to the receiver's socket
        const receiverSocketID = userSocketMap[receiverID];

        if (receiverSocketID) {
            io.to(receiverSocketID).emit("newMessage", newMessage);
        }
        res.json({ success: true, newMessage });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
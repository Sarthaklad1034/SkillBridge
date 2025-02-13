// import createError from "../utils/createError.js";
// import Message from "../models/message.model.js";
// import Conversation from "../models/conversation.model.js";

// export const createMessage = async(req, res, next) => {
//     const newMessage = new Message({
//         conversationId: req.body.conversationId,
//         userId: req.userId,
//         desc: req.body.desc,
//     });
//     try {
//         const savedMessage = await newMessage.save();
//         await Conversation.findOneAndUpdate({ id: req.body.conversationId }, {
//             $set: {
//                 readBySeller: req.isSeller,
//                 readByBuyer: !req.isSeller,
//                 lastMessage: req.body.desc,
//             },
//         }, { new: true });

//         res.status(201).send(savedMessage);
//     } catch (err) {
//         next(err);
//     }
// };
// export const getMessages = async(req, res, next) => {
//     try {
//         const messages = await Message.find({ conversationId: req.params.id });
//         res.status(200).send(messages);
//     } catch (err) {
//         next(err);
//     }
// };
import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createMessage = async(req, res, next) => {
    const { conversationId, desc } = req.body;
    const userId = req.userId;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return next(createError(404, "Conversation not found"));
        }

        if (conversation.sellerId !== userId && conversation.buyerId !== userId) {
            return next(createError(403, "Not authorized to send messages in this conversation"));
        }

        const newMessage = new Message({
            conversationId,
            userId,
            desc,
        });

        const savedMessage = await newMessage.save();

        await Conversation.findByIdAndUpdate(
            conversationId, {
                $set: {
                    readBySeller: userId === conversation.sellerId,
                    readByBuyer: userId === conversation.buyerId,
                    lastMessage: desc,
                },
            }, { new: true }
        );

        const user = await User.findById(userId).select('username avatar');

        const messageResponse = {
            ...savedMessage.toObject(),
            user: {
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
            },
        };

        res.status(201).json(messageResponse);
    } catch (err) {
        next(err);
    }
};

export const getMessages = async(req, res, next) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id })
            .sort({ createdAt: 1 })
            .populate('userId', 'username avatar');

        const conversation = await Conversation.findById(req.params.id)
            .populate('sellerId', 'username avatar')
            .populate('buyerId', 'username avatar');

        if (!conversation) {
            return next(createError(404, "Conversation not found"));
        }

        res.status(200).json({
            messages,
            conversation
        });
    } catch (err) {
        next(err);
    }
};
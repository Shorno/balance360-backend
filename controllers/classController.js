import {Class} from "../models/Class.js";

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        return res.status(200).json({
            status: 'success',
            data: classes,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
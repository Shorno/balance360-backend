import {User} from "../models/User.js";

export const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({message: "Authentication required"});
            }
            const {email} = req.user;
            const user = await User.findOne({email});


            if (!user || !allowedRoles.includes(user.role)) {
                return res.status(403).json({message: "You don't have permission for this action"});
            }

            next();
        } catch (error) {
            return res.status(500).json({message: "Server error"});
        }
    };
};
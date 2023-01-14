const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Token looks like Bearer shriya so split it into 2 and then take the bearer's name.
            token = req.headers.authorization.split(" ")[1];

            // Decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // We will return the token without the password.
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token.");
    }
});

module.exports = { protect };
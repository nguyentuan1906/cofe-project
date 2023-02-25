const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userCtrl = {
    register: async (req, res) => {
        try {
            const { email, password, name } = req.body;
            const user = await User.findOne({ email });
            if (user)
                return res.status(400).json({ msg: "Email da ton tai" });
            if (password.length < 6)
                return res.status(400).json({ msg: "Mat khau phai lon hon 6 ky tu" });
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await User({ email, password: passwordHash, name });
            await newUser.save();
            const accesstoken = createAccessToken({ id: newUser._id });
            // res.json({ accesstoken });
            const refreshtoken = createRefreshToken({ id: newUser._id });
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/user/refresh_token",
            });
            //res.json({ refreshtoken });
            return res.json({ accesstoken });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            //Chưa đăng nhập
            if (!rf_token)
                return res.status(400).json({ msg: "Chua dang nhap!" }); //Trả về thông báo chưa đăng nhập
            jwt.verify(rf_token, process.env.REFRESH, (err, user) => {
                if (err)
                    return res.status(400).json({ msg: "Chua dang nhap!" });
                const accesstoken = createAccessToken({ id: user._id });
                return res.json({ accesstoken });
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "Email chua dang ky!" });
            const pass = await bcrypt.compare(password, user.password)
            if (!pass)
                return res.status(400).json({ msg: "Sai mat khau!" });
            // res.status(200).json({msg : "Dang nhap thanh cong!"});
            const accesstoken = createAccessToken({ id: user._id });
            // res.json({ accesstoken });
            const refreshtoken = createRefreshToken({ id: user._id });
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/user/refresh_token",
            });
            return res.json({ accesstoken });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie("refreshtoken", {path: "/user/refresh_token"});
            return res.status(400).json({ msg: "Logout" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");
            if(!user)
                return res.status(400).json({ msg: "Khong ton tai user"});
            return res.json({ user });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS, { expiresIn: "1d" });
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH, { expiresIn: "7d" });
}
module.exports = userCtrl;
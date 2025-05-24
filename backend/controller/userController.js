const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { user } = require("../model/userModel");

const userModel = user;

const registerAccount = async (req, res) => {
  const { username, email, phone_number, password, password_confirm } =
    req.body;

  if (!username || !email || !phone_number || !password || !password_confirm) {
    return res.status(420).json({
      message: "Please fill in all fields",
    });
  }

  if (password !== password_confirm) {
    return res.status(421).json({
      message: "Password and Confirm Password do not match",
    });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(422).json({
      message: "Email already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      Username: username,
      Email: email,
      Password: hashedPassword,
      phone_number: phone_number,
    });
    res.status(201).json({
      message: "User has Register Account",
      data: {
        username,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const loginAccount = async (req, res) => {
  const { username, email, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(420).json({
      message: "Please fill in all fields",
    });
  }

  const user = await userModel.findOne({
    $or: [{ Email: email }, { Username: username }],
  });

  if (!user) {
    return res.status(422).json({
      message: "User not found",
    });
  }

  const match = await bcrypt.compare(password, user.Password);
  if (!match) {
    return res.status(423).json({
      message: "Invalid username or password",
    });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.ACCES_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.Username, email: user.Email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  user.SESION_TOKEN = refreshToken;
  await user.save();

  res.cookie("REFRESH_TOKEN", refreshToken, {
    HttpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ accessToken: accessToken });
};

const logoutAccount = async (req, res) => {
  try {
    const cookie = req.cookies;
    const refreshToken = cookie.REFRESH_TOKEN;

    if (!cookie) return res.sendStatus(401);
    if (!cookie.REFRESH_TOKEN) return res.sendStatus(402);

    const user = await userModel.findOne({ SESION_TOKEN: refreshToken });

    if (!user) {
      res.clearCookie("REFRESH_TOKEN", {
        HTTPOnly: true,
        secure: true,
      });
      return res.sendStatus(207);
    }

    user.SESION_TOKEN = null;
    await user.save();

    return res.status(200);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const refresh = async (req, res) => {
  const REFRESH_TOKEN = req.cookies.REFRESH_TOKEN;

  if (!REFRESH_TOKEN) return res.sendStatus(401);

  const user = await userModel.findOne({ SESION_TOKEN: REFRESH_TOKEN });

  if (!user) return res.sendStatus(402);

  jwt.verify(
    REFRESH_TOKEN,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || user.id !== decoded.id) {
        console.error(user.id, decoded.id);
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCES_TOKEN_SECRET,
        { expiresIn: "1800s" }
      );

      res.json({ ACCESS_TOKEN: accessToken });
    }
  );
};

module.exports = {
  registerAccount,
  loginAccount,
  logoutAccount,
  refresh,
};

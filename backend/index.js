require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.connect);

const User = require("./models/user.model");
const Todo = require("./models/todo.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

//Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  // validate if user is already exists
  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({
      error: true,
      message: " User already exists",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: " Registraction Successfull",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is Required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: " Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

// Get user
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

//Add ToDo
app.post("/add-todo", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const todo = new Todo({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await todo.save();

    return res.json({
      error: false,
      todo,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `Internal Server Error ${error}`,
    });
  }
});

//Edit Note
app.put("/edit-todo/:todId", authenticateToken, async (req, res) => {
  const todoId = req.params.todoId;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No chnages Provided" });
  }

  try {
    const todo = await Todo.findOne({ _Id: todoId, user_Id: user._id });

    if (!todo) {
      return res.status(400).json({ error: true, message: "Todo not found" });
    }

    if (title) todo.title = title;
    if (content) todo.content = content;
    if (tags) todo.tags = tags;
    if (isPinned) todo.isPinned = isPinned;

    await todo.save();

    return res
      .status(200)
      .json({ erro: false, todo, message: "Todo updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: `Internal server error ${error}` });
  }
});

//Get All Todos
app.get("/get-all-todo", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const todos = await Todo.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.status(200).json({
      error: false,
      todos,
      message: "All Todos Retrived Successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: `Internal Server Error ${error}` });
  }
});

// Delete Todo
app.delete("/delete-todo/:todoId", authenticateToken, async (req, res) => {
  const todoId = req.params.todoId;
  const { user } = req.user;

  try {
    const todo = await Todo.findOne({ _id: todoId, userId: user._id });
    if (!todo) {
      return res.status(500).json({ error: true, message: "Note Not Found" });
    }

    await Todo.deleteOne({ _id: todoId, userId: user._id });

    return res
      .status(200)
      .json({ error: false, message: "Todo deleted Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: `Internal Server Error ${error}` });
  }
});

// updated pinned notes
app.put("/update-pinned-todo/:todoId", authenticateToken, async (req, res) => {
  const todoId = req.params.todoId;
  const { isPinned } = req.body;
  const user = req.user;

  console.log("Todo ID:", todoId);
  console.log("User ID:", user._id);

  try {
    const todo = await Todo.findOne({ _id: todoId, userId: user._id });
    if (!todo) {
      return res.status(400).json({ error: true, message: `Todo not found` });
    }
    todo.isPinned = isPinned;
    await todo.save();
    return res.status(200).json({
      error: false,
      todo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `Internal server error ${error}`,
    });
  }
});

app.listen(8000);
module.exports = app;

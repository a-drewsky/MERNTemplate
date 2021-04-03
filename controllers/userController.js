import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import userModel from '../models/userModel.js'

export const createUser = async (req, res) => {
   try {

      const { username, password, verifyPassword } = req.body;

      //validation
      if (!username || !password || !verifyPassword) return res.status(400).json({ message: "Enter all required fields" });
      if (password.length < 6) return res.status(400).json({ message: "Password not strong enough" });
      if (password !== verifyPassword) return res.status(400).json({ message: "Passwords do not match" });

      const existingUser = await userModel.findOne({ username });
      if (existingUser) return res.status(400).json({ message: "This username is taken" });


      //password hashing
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);


      //save new user
      const newUser = new userModel({
         username,
         passwordHash
      });

      const savedUser = await newUser.save();


      //log the user in

      //sign the token (do not use sensitive information for payload, use userId or userName but must be unique)
      const token = jwt.sign({ user: savedUser._id }, process.env.JWT_SECRET);

      let expDate = new Date();
      expDate.setDate(expDate.getDate() + 7);

      //send the token in an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true, expires: expDate}).send();

   } catch (err) {
      console.error(err);
      res.status(500).send();
   }
}

export const loginUser = async (req, res) => {
   const unauthorized = () => { return res.status(401).json({ message: "Wrong username or password" }) };

   try {
      const { username, password } = req.body;

      //validation
      if (!username || !password) return res.status(400).json({ message: "Enter all required fields" });

      const existingUser = await userModel.findOne({ username });
      if(!existingUser) return unauthorized();
      const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
      if(!passwordCorrect) return unauthorized();

      //log the user in

      //sign the token (do not use sensitive information for payload, use userId or userName but must be unique)
      const token = jwt.sign({ user: existingUser._id }, process.env.JWT_SECRET);

      let expDate = new Date();
      expDate.setDate(expDate.getDate() + 7);

      //send the token in an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true, expires: expDate }).send();

   } catch (err) {
      console.error(err);
      res.status(500).send();
   }
}

export const logoutUser = async (req, res) => {
   //set the cookie to an empty string then remove it by setting the expired date in the past
   res.cookie("token", "", {httpOnly: true, expires: new Date(0)}).send();
}

export const isUserLoggedIn = async (req, res) => {
   const unauthorized = () => { return res.json(false) };
   try {
      const token = req.cookies.token;

      if(!token) return unauthorized();

      //throws an error if not verified
      jwt.verify(token, process.env.JWT_SECRET);

      res.send(true);

   } catch (err) {
      console.error(err);
      return unauthorized();
   }
}
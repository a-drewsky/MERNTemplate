import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema({
   name: { type: String, required: true}
});

const Content = mongoose.model("content", contentSchema);

export default Content;
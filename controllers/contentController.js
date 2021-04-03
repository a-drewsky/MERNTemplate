import contentModel from '../models/contentModel.js'


export const createContent = async (req, res) => {
   try{
      const { name } = req.body;

      const newContent = new contentModel({
         name: name
      });

      const savedContent = await newContent.save();
      
      res.json(savedContent);
   } catch(err) {
      console.error(err);
      res.status(500).send();
   }
}

export const getAllContent = async (req, res) => {
   try{
      const contents = await contentModel.find();
      res.json(contents);
   } catch(err) {
      console.error(err);
      res.status(500).send();
   }
}


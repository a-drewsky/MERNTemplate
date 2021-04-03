import express from 'express'

import { createContent } from '../controllers/contentController.js'
import { getAllContent } from '../controllers/contentController.js'

import auth from '../middleware/auth.js'

const router = express.Router();

router.post('/create', auth, createContent); 

router.get('/getAll', auth, getAllContent)

export default router;
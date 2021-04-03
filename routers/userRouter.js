import express from 'express'

import { createUser } from '../controllers/userController.js'
import { loginUser } from '../controllers/userController.js'
import { logoutUser } from '../controllers/userController.js'
import { isUserLoggedIn } from '../controllers/userController.js'

const router = express.Router();

router.post('/create', createUser);

router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.get('/loggedin', isUserLoggedIn);

export default router;
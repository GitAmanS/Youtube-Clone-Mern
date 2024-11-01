const express = require('express');
const { registerUser, loginUser, editUser, deleteUser } = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth'); 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/edit', authenticateUser, editUser);
router.delete('/delete',authenticateUser, deleteUser)

module.exports = router;

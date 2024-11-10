const express = require('express');
const { registerUser, loginUser, editUser, deleteUser, getUser, getChannel } = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth'); 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/edit', authenticateUser, editUser);
router.delete('/delete',authenticateUser, deleteUser)
router.get('/', authenticateUser, getUser)


const applyAuthMiddleware = (req, res, next) => {
    if (req.cookies && req.cookies.token) { 
      return authenticateUser(req, res, next);  
    }
    return next();  
  };
  
router.get('/getChannel', applyAuthMiddleware, getChannel);

module.exports = router;

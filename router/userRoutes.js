const express = require('express');
const { fetchUsers,
    fetchUserById,
    createUser,
    updateUserById,
    deleteUserById,
    validateUser
} = require('../controller/userController');

const router = express.Router();

router.get('/', fetchUsers);
router.get('/:centerno', fetchUserById);
router.post('/', createUser);
router.put('/', updateUserById);
router.delete('/:centerno', deleteUserById);
router.post('/uservalidate',validateUser)

module.exports = router;
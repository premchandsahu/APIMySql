const express = require('express');
const { fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomerById,
    deleteCustomerById
} = require('../controller/customerController');

const router = express.Router();

router.get('/', fetchCustomers);
router.get('/:customerno', fetchCustomerById);
router.post('/', createCustomer);
router.put('/:customerno', updateCustomerById);
router.delete('/:customerno', deleteCustomerById);

module.exports = router;
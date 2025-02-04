const express = require('express');
const { fetchCustomerreceipts,
    fetchCustomerreceiptById,
    createCustomerreceipt,
    updateCustomerreceiptById,
    deleteCustomerreceiptById
} = require('../controller/customerreceiptController');

const router = express.Router();

router.get('/', fetchCustomerreceipts);
router.get('/:customerreceiptno', fetchCustomerreceiptById);
router.post('/', createCustomerreceipt);
router.put('/:customerreceiptno', updateCustomerreceiptById);
router.delete('/:customerreceiptno', deleteCustomerreceiptById);

module.exports = router;
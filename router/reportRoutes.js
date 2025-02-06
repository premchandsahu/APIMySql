const express = require('express');
const { getCustomerOpeningBalance,getCustomerTransactions
} = require('../controller/reportController');

const router = express.Router();

router.get('/', getCustomerOpeningBalance);
//router.get('/:centerno', fetchCenterById);
router.post('/customeropening', getCustomerOpeningBalance);
router.post('/customertransaction', getCustomerTransactions);
/*
router.put('/', updateCenterById);
router.delete('/:centerno', deleteCenterById);
*/
module.exports = router;
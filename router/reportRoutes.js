const express = require('express');
const { getCustomerOpeningBalance,getCustomerTransactions,getItemOpeningBalance,getItemTransactions,getItemSummary,getItemSummaryp
} = require('../controller/reportController');

const router = express.Router();

//router.get('/', getCustomerOpeningBalance);
//router.get('/:centerno', fetchCenterById);
router.post('/customeropening', getCustomerOpeningBalance);
router.post('/customertransaction', getCustomerTransactions);
router.post('/itemopening', getItemOpeningBalance);
router.post('/itemtransaction', getItemTransactions);
router.post('/itemsummary', getItemSummary);
router.post('/itemsummaryp', getItemSummaryp);
/*
router.put('/', updateCenterById);
router.delete('/:centerno', deleteCenterById);
*/
module.exports = router;
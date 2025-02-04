const express = require('express');
const { fetchPaymentmodes,
    fetchPaymentmodeById,
    createPaymentmode,
    updatePaymentmodeById,
    deletePaymentmodeById
} = require('../controller/paymentmodeController');

const router = express.Router();

router.get('/', fetchPaymentmodes);
router.get('/:paymentmodeno', fetchPaymentmodeById);
router.post('/', createPaymentmode);
router.put('/', updatePaymentmodeById);
router.delete('/:paymentmodeno', deletePaymentmodeById);

module.exports = router;
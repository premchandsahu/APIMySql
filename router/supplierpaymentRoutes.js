const express = require('express');
const { fetchSupplierpayments,
    fetchSupplierpaymentById,
    createSupplierpayment,
    updateSupplierpaymentById,
    deleteSupplierpaymentById
} = require('../controller/supplierpaymentController');

const router = express.Router();

router.get('/', fetchSupplierpayments);
router.get('/:supplierpaymentno', fetchSupplierpaymentById);
router.post('/', createSupplierpayment);
router.put('/', updateSupplierpaymentById);
router.delete('/:supplierpaymentno', deleteSupplierpaymentById);

module.exports = router;
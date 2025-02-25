const express = require('express');
const { fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoiceById,
    deleteInvoiceById,
    InvoiceSummary,
    fetchLastInvoice
} = require('../controller/invoiceController');

const router = express.Router();

router.get('/:centerno', fetchInvoices);
router.get('/:invoiceno/:centerno', fetchInvoiceById);
router.post('/', createInvoice);
router.put('/:id', updateInvoiceById);
router.delete('/:invoiceno/:centerno', deleteInvoiceById);
router.post('/reportinvoicesummary', InvoiceSummary);
router.post('/lastinvoice', fetchLastInvoice);

module.exports = router;
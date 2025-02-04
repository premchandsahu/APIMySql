const express = require('express');
const { fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoiceById,
    deleteInvoiceById,
    InvoiceSummary
} = require('../controller/invoiceController');

const router = express.Router();

router.get('/:centerno', fetchInvoices);
router.get('/:invoiceno/:centerno', fetchInvoiceById);
router.post('/', createInvoice);
router.put('/:id', updateInvoiceById);
router.delete('/:invoiceno/:centerno', deleteInvoiceById);
router.post('/reportinvoicesummary', InvoiceSummary);

module.exports = router;
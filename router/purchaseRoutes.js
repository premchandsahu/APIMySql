const express = require('express');
const { fetchPurchases,
    fetchPurchaseById,
    createPurchase,
    updatePurchaseById,
    deletePurchaseById,
    purchaseSummary
} = require('../controller/purchaseController');

const router = express.Router();

router.get('/', fetchPurchases);
router.get('/:purchaseno/:centerno', fetchPurchaseById);
router.post('/', createPurchase);
router.put('/:id', updatePurchaseById);
router.delete('/:purchaseno/:centerno', deletePurchaseById);
router.post('/reportpurchasesummary', purchaseSummary);
module.exports = router;
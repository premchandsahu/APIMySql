const express = require('express');
const { fetchSuppliers,
    fetchSupplierById,
    createSupplier,
    updateSupplierById,
    deleteSupplierById
} = require('../controller/supplierController');

const router = express.Router();

router.get('/', fetchSuppliers);
router.get('/:supplierno', fetchSupplierById);
router.post('/', createSupplier);
router.put('/', updateSupplierById);
router.delete('/:supplierno', deleteSupplierById);

module.exports = router;
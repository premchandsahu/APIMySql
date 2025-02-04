const express = require('express');
const { fetchProducts,
    fetchProductById,
    createProduct,
    updateProductById,
    deleteProductById
} = require('../controller/productController');

const router = express.Router();

router.get('/', fetchProducts);
router.get('/:productno', fetchProductById);    
router.post('/', createProduct);
router.put('/', updateProductById);
router.delete('/:productno', deleteProductById);

module.exports = router;
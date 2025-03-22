const express = require('express');
const { fetchProducts,
    fetchProductById,
    createProduct,
    updateProductById,
    deleteProductById,
    fetchProductByTest
} = require('../controller/productController');

const router = express.Router();

router.get('/', fetchProducts);
router.get('/:productno', fetchProductById);    
router.post('/', createProduct);
router.put('/', updateProductById);
router.delete('/:productno', deleteProductById);
router.get('/test/:productno', fetchProductByTest);    
module.exports = router;
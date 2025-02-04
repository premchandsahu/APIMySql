const express = require('express');
const { fetchProductcategorys,
    fetchProductcategoryById,
    createProductcategory,
    updateProductcategoryById,
    deleteProductcategoryById
} = require('../controller/productcategoryController');

const router = express.Router();

router.get('/', fetchProductcategorys);
router.get('/:productcategoryno', fetchProductcategoryById);
router.post('/', createProductcategory);
router.put('/', updateProductcategoryById);
router.delete('/:productcategoryno', deleteProductcategoryById);

module.exports = router;
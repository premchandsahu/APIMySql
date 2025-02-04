const express = require('express');
const { fetchCenters,
    fetchCenterById,
    createCenter,
    updateCenterById,
    deleteCenterById
} = require('../controller/centerController');

const router = express.Router();

router.get('/', fetchCenters);
router.get('/:centerno', fetchCenterById);
router.post('/', createCenter);
router.put('/', updateCenterById);
router.delete('/:centerno', deleteCenterById);

module.exports = router;
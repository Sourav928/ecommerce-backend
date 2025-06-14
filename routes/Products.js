const express = require('express');
const { createProduct, fetchAllProducts } = require('../controller/Products');

const router = express.Router();
// /products is a base route
router.post('/', createProduct).get('/', fetchAllProducts)

exports.router = router;
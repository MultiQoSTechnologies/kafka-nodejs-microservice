const express = require('express');
// routes/productRoutes.js
const productController = require('./productController');
const sendMessage = require('./kafkaProducer');
const router = express.Router();

router.post('/', async (req, res) => {
    const { topic, message } = req.body;
    try {
        const result = await sendMessage(topic, message);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new product
router.post('/add', productController.createProduct);
// Get all products
router.get('/list', productController.getAllProducts);
// Get a single product by ID   
router.get('/view/:id', productController.getProductById);
// Update a product by ID
router.put('/update/:id', productController.updateProductById);
// Delete a product by ID
router.delete('/delete/:id', productController.deleteProductById);

module.exports = router;

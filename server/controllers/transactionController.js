const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

exports.purchaseProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found" });
        if (product.stockQuantity < quantity) return res.status(400).json({ error: "Insufficient stock" });

        // Update product stock and sales count
        product.stockQuantity -= quantity;
        product.itemsSold += quantity;
        await product.save();

        // Record the transaction
        const totalPrice = product.price * quantity;
        const transaction = new Transaction({ productId, quantity, totalPrice });
        await transaction.save();

        res.json({ message: "Purchase successful", transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, stockQuantity } = req.body;
        const product = new Product({ name, category, price, stockQuantity });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStockData = async (req, res) => {
    try {
        const products = await Product.find();
        const itemsAvailable = products.reduce((acc, product) => acc + product.stockQuantity, 0);
        const itemsSold = products.reduce((acc, product) => acc + product.itemsSold, 0);
        const revenue = products.reduce((acc, product) => acc + (product.price * product.itemsSold), 0);
        res.json({ itemsAvailable, itemsSold, revenue });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

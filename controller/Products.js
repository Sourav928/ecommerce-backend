const { Product } = require("../model/Products")

exports.createProduct = async (req, res) => {
    //this product we have to get from the API body
    const product = new Product(req.body)
    try {
        const doc = await product.save()
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.fetchAllProducts = async (req, res) => {
    //this product we have to get from the API body
    //filter = {"category":["smartphone","laptops"]}
    //sort = {_sort:"price",_order:"desc"}
    //pagination = {_page:1,_limit=10}

    let filter = {};

    let totalProductsQuery = {}

    if (req.query.category) {
        filter.category = req.query.category;
        totalProductsQuery.category = req.query.category;
    }
    if (req.query.brand) {
        filter.brand = req.query.brand;
        totalProductsQuery.brand = req.query.brand;
    }
    
    let query = Product.find(filter);
    // totalProductsQuery = query.count();

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = await query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    // const totalDocs = await totalProductsQuery.count().exec();
    // console.log({totalDocs});

    if (req.query._sort && req.query._order) {
        query = await query.sort({ [req.query._sort]: req.query._order });
    }

    try {
        const doc = await query.exec();
        // res.set('X-Total-Count',totalDocs)
        res.status(200).json(doc);
    } catch (err) {
        res.status(400).json(err)
    }
}
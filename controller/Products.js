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
    //TODO: we have to try with multiple category
    let condition = {}
    let query = Product.find(condition);
    let totalProductsQuery = Product.find(condition);

    console.log(req.query.category);

    if (req.query.category) {
        query = query.find({ category: { $in: req.query.category.split(',') } });
        totalProductsQuery = totalProductsQuery.find({
            category: { $in: req.query.category.split(',') },
        });
    }
    if (req.query.brand) {
        query = query.find({ brand: { $in: req.query.brand.split(',') } });
        totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(',') } });
    }
    //TODO: How to get sort on discounted Price not a Actual Price.
    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order });
    }

    const totalDocs = await totalProductsQuery.count().exec();
    console.log({ totalDocs });

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    try {
        const docs = await query.exec();
        res.set('X-Total-Count', totalDocs);
        res.status(200).json(docs);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.fetchProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error)
    }
}
import yup from 'yup'

export const options = {
    read :"/product =list of products with method get",
    read_by_id:"/product?id=<number> find product with id with method get",
    create:"/product create a new product with method post",
    update:"/product?id=<number> update an existing product with method patch",
    delete:"/product?id=<number> delete a product with method delete"
}
const ValidationSchema = {
    title: "title must be a string",
    price: "price must be a number",
    description: "description must be a string",
    categoryId: "id must be a number",
    images: "images must be a url in an array"
}

const productschema = yup.object(
    {
    title: yup.string("title must be a string").required(),
    price: yup.number("price must be a number").required().positive().integer(),
    description: yup.string("description must be a string").required(),
    categoryId: yup.number("id must be a number").required().positive().integer(),
    images: yup.array("images must be in an array").of(yup.string().url())
}
);


export const sendProduct = (req, res,products)=>{
    const productId = req.query.id 
    if (productId){
        const product = products.find(p => p.id === parseInt(productId));
        if(product){
            res.send(product)
        } else {
            res.status(404).send('Product not found')
        }
    }else{
        res.send(products)
}}


const validateProduct = (product) => {
    try {
      const validatedProduct = productschema.validateSync(product, {
        strict: true
      });
      return validatedProduct;
    } catch (error) {
        throw new Error('Invalid product schema');
    }
};



export const addProduct = async (req, res, products) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const product = JSON.parse(body);
        const validatedProduct = validateProduct(product);
        const result = await createProduct(validatedProduct);
        products.push(result);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(400).send({ ValidationSchema });
      }
    });
};
  


const createProduct = async (product) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    };
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products/', requestOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
};

export const deleteProduct = (req,res,products)=>{
    const productId = req.query.id 
    if (productId){
        const product = products.find(el => el.id === parseInt(productId));
        const index = products.indexOf(product)
        if(product){
            products.splice(index, 1);
            res.send(`Product with Id:${productId} has been deleted`)
        } else {
            res.status(404).send('Product not found')
        }
    }else{
        res.send("you need to specify a product Id")
}

}

export const updateProduct = (req,res,products)=>{
    const productId = req.query.id 
    if (productId){
        const productToUpdate = products.find(p => p.id === parseInt(productId));
        if(productToUpdate){
            let body = '';
            req.on('data', (chunk) => {
            body += chunk.toString();
            });
            req.on('end', async () => {
            try {
                const product = JSON.parse(body);
                const validatedProduct = validateProduct(product);
                editProduct(validatedProduct, productToUpdate)
                res.send(productToUpdate)
                
            } catch (error) {
                console.error(error);
                res.status(400).send({ ValidationSchema });
            }
            });
            
        } else {
            res.status(404).send('Product not found')
        }
    }else{
        res.send("you need to specify a product Id")
}

};

const editProduct = (validatedProduct, productToUpdate)=>{
    productToUpdate.title = validatedProduct.title;
    productToUpdate.price = validatedProduct.price;
    productToUpdate.description = validatedProduct.description;
    productToUpdate.images = validatedProduct.images;
    productToUpdate.category.id = validatedProduct.categoryId;
    

}
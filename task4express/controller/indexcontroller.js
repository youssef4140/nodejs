
import { ValidationSchema, productschema, updateschema, validateProduct, createProduct, editProduct} from '../services.js'





//app.get
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


//app.post
export const addProduct = async (req, res, products) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const product = JSON.parse(body);
        const validatedProduct = validateProduct(product, productschema);
        const result = await createProduct(validatedProduct);
        products.push(result);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(400).send({ ValidationSchema });
      }
    });
};


//app.delete
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


//app.patch
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
                const validatedProduct = validateProduct(product,updateschema);
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

import yup from 'yup'

export const options = {
    read :"/product =list of products with method get",
    read_by_id:"/product?id=<number> find product with id with method get",
    create:"/product create a new product with method post",
    update:"/product?id=<number> update an existing product with method patch",
    delete:"/product?id=<number> delete a product with method delete"
}


export const ValidationSchema = {
    title: "title must be a string",
    price: "price must be a number",
    description: "description must be a string",
    categoryId: "id must be a number",
    images: "images must be a url in an array"
}

export const productschema = yup.object(
    {
    title: yup.string().required(),
    price: yup.number().required().positive().integer(),
    description: yup.string().required(),
    categoryId: yup.number().required().positive().integer(),
    images: yup.array().of(yup.string().url())
}
);


export const updateschema = yup.object(
    {
    title: yup.string(),
    price: yup.number().positive().integer(),
    description: yup.string(),
    categoryId: yup.number().positive().integer(),
    images: yup.array().of(yup.string().url())
}
);

export const validateProduct = (product, schema) => {
    try {
      const validatedProduct = schema.validateSync(product, {
        strict: true
      });
      return validatedProduct;
    } catch (error) {
        return error;
    }
};

export const createProduct = async (product) => {
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


export const editProduct = (validatedProduct, productToUpdate) => {
    if (validatedProduct.title) {
      productToUpdate.title = validatedProduct.title;
    }
    if (validatedProduct.price) {
      productToUpdate.price = validatedProduct.price;
    }
    if (validatedProduct.description) {
      productToUpdate.description = validatedProduct.description;
    }
    if (validatedProduct.images) {
      productToUpdate.images = validatedProduct.images;
    }
    if (validatedProduct.categoryId) {
      productToUpdate.category.id = validatedProduct.categoryId;
    }
  };
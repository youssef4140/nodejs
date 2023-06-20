import express from 'express'
import {get, products} from './model/products.js'
import {sendProduct , updateProduct , addProduct, deleteProduct} from './controller/indexcontroller.js'
import {options} from './services.js'

const app = express()
const root = (req,res)=> res.send(options)

app.get('/',root);

app.get('/products', (req, res) => sendProduct(req, res, products))

app.post('/products',(req,res) => addProduct(req,res,products))

app.patch('/products',(req,res) => updateProduct(req,res,products))

app.delete('/products',(req,res) => deleteProduct(req,res,products))   

  

app.listen(8080, ()=>{get("https://api.escuelajs.co/api/v1/products")
console.log("server running on http://localhost:8080")} );

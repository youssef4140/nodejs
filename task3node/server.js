const http = require('http')
const fs = require('fs')
const yup = require('yup')


const categories = JSON.parse(fs.readFileSync('./categories.json', 'utf-8'));

const fetchexchangeRates = async (currency_code) => {
    var myHeaders = new Headers();
    myHeaders.append("apikey", "YfhJbQxcIjhAI3Lvv1yrCFeW0OiOIu6T");
  
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };
    try {
      const response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${currency_code}&from=egp&amount=1`, requestOptions)
      const data = await response.json();
      const exchange_rate = JSON.stringify(data.info.rate) ;
      return exchange_rate
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const changeprice = (exchange_rate, currency_code) => {
    const pricechange = categories
    pricechange.forEach(body => {
      body.products.forEach(product => {
        product.price = `${(parseFloat(product.price) * parseFloat(exchange_rate)).toFixed(2)} ${currency_code}`;
      });
    });

    return pricechange

  }

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

const productschema = yup.object({
    title: yup.string("title must be a string").required(),
    price: yup.number("price must be a number").required().positive().integer(),
    description: yup.string("description must be a string").required(),
    categoryId: yup.number("id must be a number").required().positive().integer(),
    images: yup.array("images must be in an array").of(yup.string().url())
})

const server = http.createServer((req, res)=>{
    console.log(req.method, req.url)
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
   
    
    if (req.method === 'GET'){
        if(req.url.split('=').at(0) == '/products?CUR'){
            const currency_code = req.url.split('=').at(-1)
            console.log(`currency code is: ${currency_code}`)

            fetchexchangeRates(currency_code)
                .then((rate)=>{
                    const result = JSON.stringify(changeprice(rate, currency_code))
                    res.write(result)
                    console.log(`exchange rate is: ${rate}`)
                    res.end()
                })
                .catch((error)=>{
                    console.error(error);
                    res.writeHead(500);
                    res.end('Error')
                })
            

        }else{
            res.write('insert products?CUR="CURRENCY_CODE"')
            res.end()
        }

    }
    if (req.method === 'POST' && req.url === '/products'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const product = productschema.validateSync(JSON.parse(body),{
                    strict: true
                });

                const result = await createProduct(product);
                res.write(JSON.stringify(result));
                res.end();
            } catch (error) {
                const Validation = {
                    title: "title must be a string",
                    price: "price must be a number",
                    description: "description must be a string",
                    categoryId: "id must be a number",
                    images: "images must be a url in an array"
                }

                res.end(JSON.stringify(Validation));
            }
        })}
   });

server.listen(8080,(error)=>{
    if(error){
        console.log('smth went wrong')
    }else {
        console.log("server is running on http://localhost:8080")

    }
});

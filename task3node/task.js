const fs = require('fs')

//products
const get = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    fs.writeFile('./products.json', JSON.stringify(data, null, 2),  ()=> {
       console.log('file written successfully')
      });
      
  } catch (error) {
    console.error("Error:", error);
  }
};
get("https://api.escuelajs.co/api/v1/products")





//categories
const categorizeproducts = () => {
  const filejson = fs.readFileSync('./products.json', 'utf-8');
  const readproducts = JSON.parse(filejson);

  const categories = readproducts.reduce((accumulator, product) => {
    const category = product.category;

    if (!(category.id in accumulator)) {
      accumulator[category.id] = {
        category: {
          id: category.id,
          name: category.name
        },
        products: []
      };
    } else {
      accumulator[category.id].products.push(product);
    }

    return accumulator;
  }, {});
  const categoryArray = Object.values(categories);

  return categoryArray;
};




const categoriesJson = JSON.stringify(categorizeproducts(), null, 2);
fs.writeFile('./categories.json', categoriesJson, () => {
  console.log('file written successfully');
});


//price
const exchangeRates = async () => {
  var myHeaders = new Headers();
  myHeaders.append("apikey", "UFazypZF07zsRZNiA04KHtw2Sa20yKLV");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };
  try {
    const response = await fetch("https://api.apilayer.com/exchangerates_data/convert?to=usd&from=egp&amount=1", requestOptions)
    const data = await response.json();
    const egptousd = JSON.stringify(data.info.rate) ;
    return egptousd  
  } catch (error) {
    console.error("Error:", error);
  }
};


const changeprice = async () => {
  const pricechange = categorizeproducts();
  const usdtoegp = await exchangeRates();
  pricechange.forEach(body => {
    body.products.forEach(product => {
      product.price = `${(parseFloat(product.price) * parseFloat(usdtoegp)).toFixed(2)} USD`;
    });
  });
  const priceJson = JSON.stringify(pricechange, null, 2);
fs.writeFile('./prices.json', priceJson, () => {
  console.log('file written successfully');
});
}
changeprice()



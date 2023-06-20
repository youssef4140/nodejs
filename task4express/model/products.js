


export let products;
export const get = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
        products = data

    } catch (error) {
      console.error("Error:", error);
    }
  };


  
  
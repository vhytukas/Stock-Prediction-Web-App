import axios from "axios"

export const getPriceData = async(ticker) =>{
  const symbol = ticker;
  

  let startDate = Math.floor(Date.now() / 1000); // Get current Unix timestamp
  const daysAgo = 811; // Number of days ago to calculate
  const date = new Date(startDate * 1000); // Convert Unix timestamp to JavaScript Date object
  date.setDate(date.getDate() - daysAgo); // Subtract 78 days from the date
  const timestamp = Math.floor(date.getTime() / 1000); // Convert the date back to Unix timestamp format
  startDate = timestamp


  const endDate = Math.floor(Date.now() / 1000);
  const proxyUrl = "https://corsproxy.io/?"; 
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&period1=${startDate}&period2=${endDate}&includeAdjustedClose=true`;
  let closePrices = []
  
      await axios.get(proxyUrl + url)
        .then(response => {
         
          const stockData = response.data.chart.result[0].indicators.quote[0].close;
          closePrices = stockData.map(data => data.toFixed(2)); // Round to 2 decimal places
          
          
    })
      .catch(error => {
      
    });

    return closePrices
    
  }

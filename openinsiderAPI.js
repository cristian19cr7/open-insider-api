const PORT = 8000
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const res = require('express/lib/response')
const { response } = require('express')


const app = express()
insiderArr = []
const keys = [
    'X',
    'Filling_Date',
    'Trade_Date',
    'Ticker',
    'Inside_Name',
    'Title',
    'Trade_Type',
    'Price',
    'Qty',
    'Owned',
    'Changed_Own',
    'Value'
]
const cluster_keys = [
    'X',
    'Filing_Date',
    'Trade_Date',
    'Ticker',
    'Company_Name',
    'Industry',
    'Ins',
    'Trade_Type',
    'Price',
    'Qty',
    'Owned',
    'Changed_Own',
    'Value'
]

const cluster_insiders_keys = [
    'X',
    'Filing_Date',
    'Trade_Date',
    'Ticker',
    'Company_Name',
    'Insider_Name',
    'Title',
    'Trade_Type',
    'Price',
    'Qty',
    'Owned',
    'Changed_Own',
    'Value'
]

app.get('/', (req, res) => {
    res.json("Welcome to the New OpenInsider API.")
});


app.get('/stock/:ticker', (req, res) => {
    
    if(insiderArr.length > 0){
        insiderArr = []
    }
    const stock = req.params.ticker
    axios.get("http://openinsider.com/"+stock)
    .then((response) => {
        const html = response.data
        const loaded_data = cheerio.load(html)
        const elementSelector = "#tablewrapper > table > tbody > tr"
        
        loaded_data(elementSelector).each((parentIdx, parentElem) => {
            const insiderObj = {}
            let keyIndex = 0
            loaded_data(parentElem).children().each((childIdx, childElem) => {     
                if(childIdx < keys.length){
                    insiderObj[keys[keyIndex]] = loaded_data(childElem).text()
                    keyIndex++
                }          
            })
         insiderArr.push(insiderObj)
        })
        console.log(insiderArr)
        res.json(insiderArr)

    })
});

app.get('/clusters', (req, res) => {
    
    if(insiderArr.length > 0){
        insiderArr = []
    }
    axios.get("http://openinsider.com/latest-cluster-buys")
    .then((response) => {
        const html = response.data
        const loaded_data = cheerio.load(html)
        const elementSelector = "#tablewrapper > table > tbody > tr"
        
        loaded_data(elementSelector).each((parentIdx, parentElem) => {
            const insiderObj = {}
            let keyIndex = 0
            loaded_data(parentElem).children().each((childIdx, childElem) => {     
                if(childIdx < cluster_keys.length){
                    insiderObj[cluster_keys[keyIndex]] = loaded_data(childElem).text()
                    keyIndex++
                }          
            })
         insiderArr.push(insiderObj)
        })
        console.log(insiderArr)
        res.json(insiderArr)
    }).catch((error) => {
        if (error.response) { // status code out of the range of 2xx
            console.log("Data :" , error.response.data);
            console.log("Status :" + error.response.status);
          } else if (error.request) { // The request was made but no response was received
            console.log(error.request);
          } else {// Error on setting up the request
            console.log('Error', error.message);
          }
    })
});

app.get('/clusters-insiders', (req, res) => {
    
    if(insiderArr.length > 0){
        insiderArr = []
    }
    axios.get("http://openinsider.com/insider-purchases-25k")
    .then((response) => {
        const html = response.data
        const loaded_data = cheerio.load(html)
        const elementSelector = "#tablewrapper > table > tbody > tr"
        
        loaded_data(elementSelector).each((parentIdx, parentElem) => {
            const insiderObj = {}
            let keyIndex = 0
            loaded_data(parentElem).children().each((childIdx, childElem) => {     
                if(childIdx < cluster_insiders_keys.length){
                    insiderObj[cluster_insiders_keys[keyIndex]] = loaded_data(childElem).text()
                    keyIndex++
                }          
            })
         insiderArr.push(insiderObj)
        })
        console.log(insiderArr)
        res.json(insiderArr)
    }).catch((error) => {
        if (error.response) { // status code out of the range of 2xx
            console.log("Data :" , error.response.data);
            console.log("Status :" + error.response.status);
          } else if (error.request) { // The request was made but no response was received
            console.log(error.request);
          } else {// Error on setting up the request
            console.log('Error', error.message);
          }
    })
});


app.listen(PORT, () => console.log(`server running on port ${PORT}`));
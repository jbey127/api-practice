const axios = require('axios')
async function makePostRequest(url,postData) {
    try {
        const response = await axios.post(url, postData);
        return response.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}
async function makeGetRequest(url){
    try{
    const response = await axios.get(url)
    console.log("Response Data", response.data)
    } catch(error){
        console.error("Error:", error.response ? error.response.data : error. message)
    }

}
const url = 'https://api-practice-6jrk.onrender.com/items'
let data = {
    name: "Justus"
}
let items = [
    { id: 1, name: 'Item One' },
    { id: 2, name: 'Item Two' },
    { id: 2, name: 'Justus' }
  ]
console.log(makePostRequest(url, data))

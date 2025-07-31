const https = require('https');

const alchemyApiKey = '2kJcVipgpw3tdv6LvlpGk4cNm7w9yWVf';
const url = `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`;

console.log('Checking Alchemy API key...');
console.log(`Using URL: ${url}`);

// JSON-RPC request format for eth_blockNumber
const data = JSON.stringify({
  jsonrpc: "2.0",
  method: "eth_blockNumber",
  params: [],
  id: 1
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(url, options, (res) => {
  let responseData = '';
  
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonResponse = JSON.parse(responseData);
      console.log('API Response:');
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (jsonResponse.result) {
        console.log('\nAlchemy API Key is valid and working! ✓');
        console.log(`Current block number: ${parseInt(jsonResponse.result, 16)}`);
      } else if (jsonResponse.error) {
        console.log('\nAPI Key might not be working correctly. ✗');
        console.log('Error:', jsonResponse.error.message);
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error.message);
});

req.write(data);
req.end(); 
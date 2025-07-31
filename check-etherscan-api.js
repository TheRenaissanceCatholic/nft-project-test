const https = require('https');

const apiKey = '7WMKIW8GVXV81K41NSGSM7MRD2GPHPVJF6';
const url = `https://api-sepolia.basescan.org/api?module=account&action=balance&address=0x0000000000000000000000000000000000000000&tag=latest&apikey=${apiKey}`;

console.log('Checking Etherscan API key...');
console.log(`Using URL: ${url}`);

https.get(url, (res) => {
  let data = '';
  
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonResponse = JSON.parse(data);
      console.log('API Response:');
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (jsonResponse.status === '1' && jsonResponse.message === 'OK') {
        console.log('\nAPI Key is valid and working! ✓');
      } else {
        console.log('\nAPI Key might not be working correctly. ✗');
        console.log('Check the response message for details.');
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('Raw response:', data);
    }
  });
}).on('error', (error) => {
  console.error('Error making request:', error.message);
}); 
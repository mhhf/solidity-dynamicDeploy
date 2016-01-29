var Web3 = require("web3");

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var address = "15 2d f2 45 51 2f 11 71 0b 4d 8a 5c 9e 2d 83 e4 e4 16 31 ce".split(' ').join('');

var code = web3.eth.getCode(address);

console.log( code );

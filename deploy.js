var Web3 = require("web3");

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// var Logger = web3.eth.contract([{"constant":false,"inputs":[],"name":"calllog","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"what","type":"bytes"}],"name":"log","type":"event"}]);
// var log = Logger.at('0x335f6f9a2292d373846d3c1d998b7f6466d509e9');
// console.log(log);
// console.log(web3.eth.getCode('0x335f6f9a2292d373846d3c1d998b7f6466d509e9'));

// var e = log.log();
//
// e.watch( function(err,res) {
//   if(err) throw err;
//   console.log(err,res);
// })

  
// var callog = log.calllog({from: web3.eth.coinbase});
// console.log(callog);
//
// Logger.new({
//   data: "6060604052730393244466408bf374110c4af2f9be44d6759614600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060b2806100506000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063179b087c146037576035565b005b604260048050506044565b005b7f0be77f5642494da7d212b92a3472c4f471abb24e17467f41788e7de7915d62386040518080602001828103825260038152602001807f6f6d67000000000000000000000000000000000000000000000000000000000081526020015060200191505060405180910390a15b56",from: web3.eth.coinbase
// }, function(err,res) {
//   console.log('!',err,res);
// })


var DynCreate = web3.eth.contract([]);
// DYNAMIC DEPLOY CONTRACT
var binary = "0x601480600b6000396000f33680600060003760006000f060005260206000f3";
var namecoin = "0x606060405260158060006000396000f360606040523615600d57600d565b60135b5b565b00";

// Deploy:
var dynCreate = DynCreate.new({
  from: web3.eth.coinbase,
  data: binary
}, function( err, res ) {
  if( err ) throw err;

  // GET THE ADDRESS
  // web3.eth.getTransactionReceipt( res.transactionHash, function( err, res ) {
  //   if( err ) throw err;
  //
  // console.log(res);
  // var address = res.contractAddress;
  var address = res.address;
  if(!address) return null;
  console.log(address);
  //
  //

  // Verify code
  var code = web3.eth.getCode( address );
  console.log( "Deployed code is: ", code );
  //
  //
  // // Send transaction
  web3.eth.sendTransaction({
    from: web3.eth.coinbase,
    to: address,
    data: namecoin 
  }, function( err, txHash ) {
    if( err ) throw err;

    web3.eth.getTransactionReceipt( txHash, function( err, res ) {
      console.log(err, res);
    });

  });
  //
  // });

});






// var address = "0x6580ee5690b6c3ab48b439dcfcf4d1d36fab3a39";
//

// verify
// var code = web3.eth.getCode( address );
// console.log(code);
// 

// web3.eth.sendTransaction({
//   from: web3.eth.coinbase,
//   to: address,
//   data: binary
// }, function( err, res ) {
//   console.log( err, res );
// });

// var txHash = "0x49a9ede50c7a7b8f5fdb28d0c442a259b2b620f28f358d7432759e145f8eed90"
//
// web3.eth.getTransactionReceipt( txHash, function( err, res ) {
//   console.log(err, res);
// })
// console.log(web3.eth.blockNumber);


// web3.eth.getBlock(13, function( e, r) {
//   console.log(r);
// })
//
// web3.eth.getBlock(14, function( e, r) {
//   console.log(r);
// })
//
// web3.eth.getBlock(15, function( e, r) {
//   console.log(r);
// })

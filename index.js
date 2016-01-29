var fs = require('fs');
var exec = require('sync-exec');;
var colors = require('colors')
var opcodes = require('./opcodes.js');


var lll = fs.readFileSync('c.lll').toString();
// var lll = fs.readFileSync('namecoin.lll').toString();
// var lll = fs.readFileSync('simpledeploy.lll').toString();

lll = lll.split("\n").join("");
console.log('compiling: '+lll);

var raw = exec(`serpent compile_lll "${lll}"`);
code = raw.stdout.replace('\n','','g');

console.log('compiled:' +code);

var VM = require('ethereumjs-vm')
var vm = new VM()

// code = "60606040523615600d57600d565b60135b5b565b00"
// namecoin
// code = "606060405260158060006000396000f360606040523615600d57600d565b60135b5b565b00"
// 
// dyn con
// main = "600d80600b60003960185836600060003750"


// f0 CREATE <codelength> <memoffset> <value> -> s(0) address
// f3 RETURN <memlength> <memoffset>
// 52 MSTORE <word> <memoffset>
// 36 CALLDATASIZE -> datasize on stack 0
// 37 calldatacopy <datalength> <dataoffset> <mem_offset>


// (CALLDATACOPY 0 0 (CALLDATASIZE) )
var c_store_data_in_memory = "36806000600037"

// (CREATE 0 0 (CALLDATASIZE))
var c_create_contract = "60006000f0"

// (MSTORE <zeug> 0)
var c_store_address_in_memory = "600052"

// (RETURN 20 0)
var c_return_address = "60206000f3"

// FINAL CONTRACT
main = c_store_data_in_memory 
     + c_create_contract
     + c_store_address_in_memory
     + c_return_address;


// main = "60606040523615600d57600d565b60135b5b565b00"
var mainLength = (main.length/2).toString('16');
var prefixLength = '0'+( 11 ).toString('16');

prefix = `60${ mainLength }8060${ prefixLength }6000396000f3`
// MAIN CODE
code = prefix + main;
// 
// code = main;
console.log(code);

code = new Buffer(code, 'hex')

nameOpCodes(code);

vm.on('step', function (data) {
  // console.log(data);
  // 
  var ins = data.stack.slice( 0, data.opcode.in ).map( o => o.toString()).join(' ');
  // console.log(data);
  // console.log(data.stack.slice( 0, data.opcode.in ).map( o => o.toString()));
  console.log();
  console.log(data.stack.map( (e => e.toString('hex') === ''?'00':e.toString('hex')) ).join(',').green);
  // console.log(data.opcode.name.red + ' ' + ins.green + ' ' + data.memory.join('') )
  
})

vm.runCode({
  code: code,
  gasLimit: new Buffer('ffffffff', 'hex')
}, function (err, results) {
  console.log(results);
  console.log('returned: ' + results.return.toString('hex'))
  // console.log('gasUsed: ' + results.gasUsed.toString())
  console.log(err)
});


function nameOpCodes (raw) {
  var pushData = '';

  for (var i = 0; i < raw.length; i++) {
    var pc = i
    var opc = opcodes(raw[pc], true);
    var curOpCode = opc.name

    // no destinations into the middle of PUSH
    if (curOpCode.slice(0, 4) === 'PUSH') {
      var jumpNum = raw[pc] - 0x5f
      pushData = raw.slice(pc + 1, pc + jumpNum + 1)
      i += jumpNum
    }

    console.log(pad(pc, roundLog(raw.length, 10)) + '  ' + curOpCode.red + ' ' + pushData.toString('hex').green)

    pushData = ''
  }
}

function pad (num, size) {
  var s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

function log (num, base) {
  return Math.log(num) / Math.log(base)
}

function roundLog (num, base) {
  return Math.ceil(log(num, base))
}

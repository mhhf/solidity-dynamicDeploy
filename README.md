# Dynamic contract creation

  This is a **Proof of Concept**. Currently only briefly tested on ethereumjs-vm.

  Goal was to come up with a solution to let contracts dynamicly create other 
  contracts from a buffer.  This allowes the possibility to let contracts deploy 
  contracts, which weren't present at compile time, but given dynamically in 
  another process.

## Usage

  1. Deploy the dynamic deployer contract: 
    `0x601480600b6000396000f33680600060003760006000f060005260206000f3`
    
  2. call it with the contract you want to be deployed out of solidity and 
    recieve the new address of the contract.

### Example

```
contract A {

  [...]

  address deployer = <address>
  bytes contract;
  address deployedAddress;
  
  function setupContract (bytes data) {
    contract = data;
  }

  function deploy() {
    deployedAddress = deployer.call( contract );
  }

}
```

## How it Works
  
  To deploy another contract out of solidity, the contract has to be presented 
  at compile time and called like this:
  ```
  contract <Name> { ... }
  
  contract Deployer {
    function deploy(){
      address addr = new <Name>();
    }
  }
  ```
  
  This don't allow the possibility to pass a contract dynamicly to deploy it.
  However, the EVM is capable of this feature: 
  
  It can create a contract with the `CREATE` opcode. The contract code is taken 
  from the current contract memory.
  
### Contract Composition:

  Following opcodes are used (apart from trivial):
```
f0 CREATE <codelength> <memoffset> <value> -> address on stack 0
f3 RETURN <memlength> <memoffset>
52 MSTORE <word> <memoffset>
36 CALLDATASIZE -> datasize on stack 0
37 CALLDATACOPY <datalength> <dataoffset> <mem_offset>
```

`DEPLOYER := PREFIX + MAIN`

The full contract is composed out of a `PREFIX`, which deploys the actual contract. It copies
its code to the memory, and returns it.

`60${ mainLength }80600b6000396000f3`

The `MAIN` part has the following structure:

1. stores the passed data to the memory

`36806000600037`

2. creates a new contract, based on the memory

`60006000f0`

3. stores the address to the memory

`600052`

4. returns the memory

`60206000f3`


### Opcode representation:

```
PC  OPCODES
------------
00  PUSH1 14
02  DUP1
03  PUSH1 0b
05  PUSH1 00
07  CODECOPY
08  PUSH1 00
10  RETURN
11  CALLDATASIZE
12  DUP1
13  PUSH1 00
15  PUSH1 00
17  CALLDATACOPY
18  PUSH1 00
20  PUSH1 00
22  CREATE
23  PUSH1 00
25  MSTORE
26  PUSH1 20
28  PUSH1 00
30  RETURN
```
  

## Why?

muy importante use cases

## TODOS

  * implement constructor args
  * test on a real chain

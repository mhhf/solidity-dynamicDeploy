contract A{
  address deployer = 0x0393244466408bf374110c4af2f9be44d6759614;
  
  event log(bytes what);
  
  function calllog(){
    log("omg");
  }

}

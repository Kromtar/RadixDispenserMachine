var Radix = require('radixdlt');
var Storage = require('node-storage');
var moment = require('moment');
var store = new Storage('storage/accunts');

Radix.radixUniverse.bootstrap(Radix.RadixUniverse.BETANET_EMULATOR);
const identityManager = new Radix.RadixIdentityManager();
const radixToken = Radix.radixUniverse.nativeToken;
const timeOutboodo = 500;

global.transactionBuffer = [];

machineDeamon();

//--------------------------------------------------------
//MAQUINA DEAMON
//--------------------------------------------------------
async function machineDeamon(){
  let machineIdenEncryp, machinePass, machineAdd, machineIdenDecrypt;
  machineIdenEncryp = store.get('machineIden');
  machinePass = store.get('machinePass');
  machineAdd = store.get('machineAdd');
  try {
    machineIdenDecrypt = await decryptKey(machineIdenEncryp, machinePass);
    machineAcc = machineIdenDecrypt.account;
    openConnectionAndSync(machineAcc).then((machineAcc) => {
      machineAcc.transferSystem.transactionSubject.subscribe(transactionUpdate => {
        //console.log(transactionUpdate);
        /*
        console.log('Machine recibio un pago de: ');
        console.log(Object.keys(transactionUpdate.transaction.participants)[0]);
        console.log('de: ');
        console.log(transactionUpdate.transaction.tokenUnitsBalance[Object.keys(transactionUpdate.transaction.tokenUnitsBalance)[0]]);
        console.log('con el token: ');
        console.log(Object.keys(transactionUpdate.transaction.tokenUnitsBalance)[0]);
        console.log('Con el mensaje: ');
        console.log(transactionUpdate.transaction.message);
        */

        var newTransactionBuffer = {
          originAdd: Object.keys(transactionUpdate.transaction.participants)[0],
          amount: transactionUpdate.transaction.tokenUnitsBalance[Object.keys(transactionUpdate.transaction.tokenUnitsBalance)[0]],
          tokenType: Object.keys(transactionUpdate.transaction.tokenUnitsBalance)[0],
          message: transactionUpdate.transaction.message,
          timeStamp: transactionUpdate.transaction.timestamp
        };

        //TODO: Validamos que sea el tipo de token aceptado
        if(newTransactionBuffer.tokenType == '/9ef5tHqRYXP2UyB84wBAPfkUEHUrWZNYaGyLVocHCNW9SL4v9UM/UAI01'){
          //TODO: Validamos que la cantidad transferida corresponda a la id del producto (tambien podemos validar que quede suficientes unidades)
          if(newTransactionBuffer.amount == 3 && newTransactionBuffer.message == '123'){
            //TODO: Buscamos el dueño del producto (en un futuro desde una lista)
            newTransactionBuffer.seller = '9hP4DkSCFhBkgK3bUNUdM3PGAJwXHnp46bGb1EBZmdkMBPFPpkA';
            //TODO: SOLO AGRGAR SI SU ID NO ESTA EN EL BUFFER
            transactionBuffer.push(newTransactionBuffer);
          }
        }
        //console.log(transactionBuffer);
      });
    });
  } catch(error) {
    machineIdenDecrypt = null;
    console.error('Error decrypting private key', error);
  }
}



//--------------------------------------------------------


//Desencripta una endidad almacenada en memoria
function decryptKey(idenEncryp, senderPass) {
  return new Promise((resolve, reject) => {
    Radix.RadixKeyStore.decryptKey(idenEncryp, senderPass).then((data) => {
      var senderIdenDecrypt = new Radix.RadixSimpleIdentity(data);
      resolve(senderIdenDecrypt);
    }).catch((error) => {
      reject(error);
    });
  });
}

//Extrae la identidad (desencirptada), las direcciones y la cuenta de dos usuarios necesarios para una transaccion de forma dinamica
async function setRoles(from, to){
  var senderIdenEncryp, senderIdenDecrypt, senderPass, senderAdd, senderAcc, receiverAdd;
  if(from == 'a'){
    senderIdenEncryp = store.get('slaveIden');
    senderPass = store.get('slavePass');
    senderAdd = store.get('slaveAdd');
    try {
      senderIdenDecrypt = await decryptKey(senderIdenEncryp, senderPass);
      senderAcc = senderIdenDecrypt.account;
    } catch(error) {
      senderIdenDecrypt = null;
      console.error('Error decrypting private key', error);
    }
  }else if(from == 'b'){
    senderIdenEncryp = store.get('masterIden');
    senderPass = store.get('slavePass');
    senderAdd = store.get('masterAdd');
    try {
      senderIdenDecrypt = await decryptKey(senderIdenEncryp, senderPass);
      senderAcc = senderIdenDecrypt.account;
    } catch(error) {
      senderIdenDecrypt = null;
      console.error('Error decrypting private key', error);
    }
  }else if(from == 'c'){
    senderIdenEncryp = store.get('machineIden');
    senderPass = store.get('machinePass');
    senderAdd = store.get('machineAdd');
    try {
      senderIdenDecrypt = await decryptKey(senderIdenEncryp, senderPass);
      senderAcc = senderIdenDecrypt.account;
    } catch(error) {
      senderIdenDecrypt = null;
      console.error('Error decrypting private key', error);
    }
  }else{
    senderIdenEncryp = null;
    senderAdd = null;
    senderIdenDecrypt = null;
    senderPass = null;
    senderAcc = null;
  }
  if(to == 'a'){
    receiverAdd =  store.get('slaveAdd');
  }else if(to == 'b'){
    receiverAdd =  store.get('masterAdd');
  }else if(to == 'c'){
    receiverAdd =  store.get('machineAdd');
  }else{
    receiverAdd = null;
  }
  return {senderAdd, senderIdenDecrypt, senderAcc, receiverAdd};
}

//Sincroniza una cuenta con la red y espera que se termine de sincronizar, retorna la cuenta
function openConnectionAndSync(acc) {
  return new Promise((resolve, reject) => {
    acc.openNodeConnection().then(() => {
      acc.isSynced().subscribe(status => {
        //console.log(status);
        if(status){  
          resolve(acc);
        }
      });
      //setTimeout(() => resolve(acc),5000);
    })
  });
}

//Realiza una transaccion de dinero de un usuario a otro
async function lunchTransaction(senderAcc, senderIdenDecrypt, receiverAdd, amount, tokenType, msg){
  const receiverAcc = Radix.RadixAccount.fromAddress(receiverAdd, true);
  senderAcc = await openConnectionAndSync(senderAcc);
  if(tokenType==='default'){
    tokenType = radixToken
  }
  return new Promise((resolve, reject) => {
    const transactionStatus = Radix.RadixTransactionBuilder.createTransferAtom(senderAcc, receiverAcc, tokenType, amount, msg).signAndSubmit(senderIdenDecrypt);
    //resolve();
    transactionStatus.subscribe({
      next: status => {console.log(status)},
      complete: () => {
        resolve();
      },
      error: err => {
        console.log(err);
        reject(err);
      }
    });
  });
}

//Obtiene la direccion y cuenta de un usuario almacenado en memoria de forma dinamica
function getRole(user){
  var userAdd, userAcc;
  if(user == 'a'){
    userAdd = store.get('slaveAdd');
    userAcc = Radix.RadixAccount.fromAddress(userAdd);
  }else if(user == 'b'){
    userAdd = store.get('masterAdd');
    userAcc = Radix.RadixAccount.fromAddress(userAdd);
  }else if(user == 'c'){
    userAdd = store.get('machineAdd');
    userAcc = Radix.RadixAccount.fromAddress(userAdd);
  }else{
    userAdd = null;
    userAcc = null;
  }
  return {userAdd, userAcc};
}

//Obtiene el balance final de una cuenta
function updateBalance(acc) {
  return new Promise((resolve, reject) => {
    openConnectionAndSync(acc).then((acc) => {
      //Estamos ocupando el timeout de los objetos Observables de JS
      //TODO: Puede que baste con esperar que el Sync este completo para saber el balance
      /*
      acc.transferSystem.getTokenUnitsBalanceUpdates().timeout(timeOutboodo).subscribe(
        balance => {},
        timeoutErr => {
          //Unsub?
          resolve(acc.transferSystem.tokenUnitsBalance);
        },
        end => {}
      );
      */
     resolve(acc.transferSystem.tokenUnitsBalance);
    });
  });
}

async function sendTokens(req, res) {
  const {from, to, amount, tokenType} = req.body;
  try{
    var roles = await setRoles(from, to);
    const msg = '';
    await lunchTransaction(roles.senderAcc, roles.senderIdenDecrypt, roles.receiverAdd, amount, tokenType, msg);
    res.status(200).send({});
  }catch(err){
    console.log(err);
    res.status(404).send(err);
  }
}

async function viewBalance(req, res) {
  const {user} = req.body;
  try{
    var role = getRole(user);
    var balance = await updateBalance(role.userAcc);
    console.log(balance);
    res.status(200).send({balance});
  }catch(err){
    console.log(err);
    res.status(404).send(err);
  }
}

//TODO PARAMETRICAR
async function getFromFaucet(req, res){
  const {user} = req.body;
  try{
    var roles = await setRoles(user, 'b');
    const faucetAddress = '9ecjMNCFDSbLZxVpfbFwFTLWuL7SH3Q49uzGrpK3bUcze6CJtDr';
    //LOCALHOST_SINGLENODE JH1P8f3znbyrDj8F4RWpix7hRkgxqHjdW2fNnKpR3v6ufXnknor
    //BETANET_EMULATOR 9ecjMNCFDSbLZxVpfbFwFTLWuL7SH3Q49uzGrpK3bUcze6CJtDr
    const message = 'Dear Faucet, may I please have some money?';
    const faucetAccount = Radix.RadixAccount.fromAddress(faucetAddress, true);
    roles.senderAcc = await openConnectionAndSync(roles.senderAcc);
    Radix.RadixTransactionBuilder.createRadixMessageAtom(roles.senderAcc,faucetAccount, message).signAndSubmit(roles.senderIdenDecrypt);
    //TODO se supone que como el sync esta completo podemos acceder al balance sin tener que hacer la sub, pero lo dejamos asi para tener variedad de codigo
    roles.senderAcc.transferSystem.getTokenUnitsBalanceUpdates().subscribe(balance => {
      console.log(roles.senderAcc.transferSystem.tokenUnitsBalance[radixToken.toString()]);
    });
    res.status(200).send({});
  }catch(err){
    console.log(err);
    res.status(404).send(err);
  }
}

//CREAR CUENTAS
async function createAccunts(req, res){
  /*
  const myIdentity1 = identityManager.generateSimpleIdentity();
  const myAccount1 = myIdentity1.account;
  myAccount1.openNodeConnection();
  const password1 = '123456';
  Radix.RadixKeyStore.encryptKey(myIdentity1.address, password1).then((encryptedKey) => {
    store.put('slaveIden', encryptedKey);
  }).catch((error) => {
    console.error('Error encrypting private key', error);
  });
  store.put('slaveAdd', myAccount1.getAddress());
  store.put('slavePass', password1);

  const myIdentity2 = identityManager.generateSimpleIdentity();
  const myAccount2 = myIdentity2.account;
  myAccount2.openNodeConnection();
  const password2 = '123456';
  Radix.RadixKeyStore.encryptKey(myIdentity2.address, password2).then((encryptedKey) => {
    store.put('masterIden', encryptedKey);
  }).catch((error) => {
    console.error('Error encrypting private key', error);
  });
  store.put('masterAdd', myAccount2.getAddress());
  store.put('masterPass', password2);
  
  const myIdentity3 = identityManager.generateSimpleIdentity();
  const myAccount3 = myIdentity3.account;
  myAccount3.openNodeConnection();
  const password3 = '123456';
  Radix.RadixKeyStore.encryptKey(myIdentity3.address, password3).then((encryptedKey) => {
    store.put('machineIden', encryptedKey);
  }).catch((error) => {
    console.error('Error encrypting private key', error);
  });
  store.put('machineAdd', myAccount3.getAddress());
  store.put('machinePass', password3);
  */
  res.status(200).send({});
}

async function createToken(req, res){
  const {user} = req.body;
  try{

    var roles = await setRoles(user, 'b');
    roles.senderAcc = await openConnectionAndSync(roles.senderAcc);

    const symbol = 'UAI01';
    const name = 'Example Coin UAI v0.1';
    const description = 'Example Coin UAI v0.1';
    const granularity = 1;
    const amount = 1000;
    const iconUrl = 'http://a.b.com/icon.png';

    new Radix.RadixTransactionBuilder().createTokenSingleIssuance(
      roles.senderAcc,
      name,
      symbol,
      description,
      granularity,
      amount,
      iconUrl,
    ).signAndSubmit(roles.senderIdenDecrypt)
    .subscribe({
      next: status => {
        console.log(status)
      },
      complete: () => { 
        console.log('Token defintion has been created');
        res.status(200).send({});  
      },
      error: error => { 
        console.error('Error submitting transaction', error) 
      }
    });
  }catch(err){
    console.log(err);
    res.status(404).send(err);
  }
}

//---------------------------------------------------------------------------------------------------------------//

async function testGenerateInvoice(req, res){

  const valorProducto = 3;
  const idProducto = 123;
  const cuentaMaquina = '9ezKGNbEoVsVUbTXgDws6wL7HhXzLRwimE7GKNDEjxuBYVzwRvV';
  const monedaAceptada = '/9ef5tHqRYXP2UyB84wBAPfkUEHUrWZNYaGyLVocHCNW9SL4v9UM/UAI01';
  const inicioMensaje = 'https://www.radixdlt.com/dapp/payment/';

  const sendto = 'send?to=' + cuentaMaquina + '&';
  const amount = 'amount=' + valorProducto + '&';
  const token = 'token=' + monedaAceptada + '&';
  const attachment = 'attachment=' + idProducto;

  const bigMsg = inicioMensaje + sendto + amount + token + attachment;

  // FORMATO INVOICE:
  // https://www.radixdlt.com/dapp/payment/send?to=JEvucrcfDiibRQgxNP1TGaN2xvv8gH9mCVodSransf4bjyxc4Z9&amount=1&token=/JHuDLpGefPssAY3v1pTXTQWHGv1tkTCEdq7RQYPnLuin1cfoath/XRD&attachment=Hola

  try{
    console.log(bigMsg);
    res.status(200).send({'qr': bigMsg});
  }catch(err){
    console.log(err);
    res.status(404).send(err);
  }
}

async function testHacerPago(req, res){
  const {from} = req.body;
  const to = '9ezKGNbEoVsVUbTXgDws6wL7HhXzLRwimE7GKNDEjxuBYVzwRvV';
  const amount = 3;
  const tokenType = '/9ef5tHqRYXP2UyB84wBAPfkUEHUrWZNYaGyLVocHCNW9SL4v9UM/UAI01';
  const msg = '123';
  try{
    var roles = await setRoles(from, to);
    await lunchTransaction(roles.senderAcc, roles.senderIdenDecrypt, to, amount, tokenType, msg);
    res.status(200).send({});
  }catch(err){
    console.log(err);
    res.status(404).send(err);
  }
}

async function testShowMyAddToMachine(req, res){
  const {user} = req.body;
  var role = getRole(user);
  var add = role.userAdd;

  let machineIdenEncryp, machinePass, machineAdd, machineIdenDecrypt;
  machineIdenEncryp = store.get('machineIden');
  machinePass = store.get('machinePass');
  machineAdd = store.get('machineAdd');
  machineIdenDecrypt = await decryptKey(machineIdenEncryp, machinePass);
  machineAcc = machineIdenDecrypt.account;

  var esta = false;
  var amount, tokenType, seller;
  transactionBuffer.forEach(element => {
    if(element.originAdd == add){
      esta = true;
      seller = element.seller;
      tokenType = element.tokenType;
      amount = element.amount;
    }
  });
  if(esta){
    try {
      var msg = '';
      await lunchTransaction(machineAcc, machineIdenDecrypt, seller, amount, tokenType, msg);
      console.log('Dinero pagado al dueño original');
      transactionBuffer.forEach((element, index) => {
        if(element.originAdd == add){
          transactionBuffer.splice(index, 1); 
          console.log('Trabsaccion elminada del buffer');
        }
      });
    } catch(error) {
      machineIdenDecrypt = null;
      console.error('Error decrypting private key', error);
    }
  }else{
    console.log('No se ha registrado una transaccion de usted');
  }
  try{
    console.log(transactionBuffer);
    res.status(200).send({});
  }catch(err){
    console.log(err);
    res.status(404).send(err);
  }
}



module.exports = {
    sendTokens,
    viewBalance,
    getFromFaucet,
    createAccunts,
    createToken,
    testGenerateInvoice,
    testHacerPago,
    testShowMyAddToMachine
};

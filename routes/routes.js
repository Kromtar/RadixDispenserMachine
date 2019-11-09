const controllers = require('../controllers/controllers');

module.exports = app => {
    app.post(
        '/sendTokens',
        controllers.sendTokens
    );
    app.post(
        '/viewBalance',
        controllers.viewBalance
    );
    app.post(
        '/getFromFaucet',
        controllers.getFromFaucet
    );
    app.post(
        '/createAccunts',
        controllers.createAccunts
    );
    app.post(
        '/createToken',
        controllers.createToken
    );
//-------------------------------------------------------------
    app.post(
        '/testGenerateInvoice',
        controllers.testGenerateInvoice
    );
    app.post(
        '/testShowMyAddToMachine',
        controllers.testShowMyAddToMachine
    );
    app.post(
        '/testHacerPago',
        controllers.testHacerPago
    );
};

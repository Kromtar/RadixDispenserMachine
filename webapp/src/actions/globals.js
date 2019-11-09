import axios from 'axios';

import {
    SET_GLOBAL_CONFIG,
    SET_QT
} from './types';

//enviar dinero de de A a B
export const sendTokens = (data) => async (dispatch) => {
  try {
      let body = JSON.stringify({
        from: data.from,
        to: data.to,
        amount: data.amount,
        tokenType: data.tokenType
      });
      let config = {
          headers: {
              'Content-Type': 'application/json'
          }
      };
      console.log(body);
      const res = await axios.post('/sendTokens',body,config);
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
};

//enviar dinero de B a A

//consultar por monto de X
export const viewBalance = (data) => async (dispatch) => {
  try {
      let body = JSON.stringify({
        user: data.user
      });
      let config = {
          headers: {
              'Content-Type': 'application/json'
          }
      };
      const res = await axios.post('/viewBalance',body,config);
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
};

export const getFromFaucet = (data) => async (dispatch) => {
  try {
      let body = JSON.stringify({
        user: data.user
      });
      let config = {
          headers: {
              'Content-Type': 'application/json'
          }
      };
      const res = await axios.post('/getFromFaucet',body,config);
      return true;
  } catch (err) {
      console.log(err);
      return false;
  }
};

export const createAccunts = (data) => async (dispatch) => {
    try {
        let body = JSON.stringify({});
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post('/createAccunts',body,config);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
  };

export const createToken = (data) => async (dispatch) => {
    try {
        let body = JSON.stringify({
            user: data.user
        });
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post('/createToken',body,config);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

//-------------------------------------------------------------------

export const testGenerateInvoice = (data) => async (dispatch) => {
    try {
        let body = JSON.stringify({});
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post('/testGenerateInvoice',body,config);
        dispatch({ type: SET_QT, payload: res.data});
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const testHacerPago = (data) => async (dispatch) => {
    try {
        let body = JSON.stringify({
            from: data.from,
        });
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post('/testHacerPago',body,config);
        dispatch({ type: SET_QT, payload: res.data});
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const testShowMyAddToMachine = (data) => async (dispatch) => {
    try {
        let body = JSON.stringify({
            user: data.user
        });
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post('/testShowMyAddToMachine',body,config);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

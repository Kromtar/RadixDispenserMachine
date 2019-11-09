import { SET_QT } from '../actions/types';

export default function(state = {qr: 'null'} , action) {
  switch (action.type){
    case SET_QT:
      return action.payload;
    default:
      return state;
  }
}

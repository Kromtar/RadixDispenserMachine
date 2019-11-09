import { TEST } from '../actions/types';

export default function(state = 0 , action) {
  switch (action.type){
    case TEST:
      return action.payload;
    default:
      return state;
  }
}

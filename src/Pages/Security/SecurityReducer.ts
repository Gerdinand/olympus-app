import SecurityActions from './SecurityActions';

export interface SecurityState {
  gesture: string;
  fingerprint: boolean;
  userLoged: boolean;
}

const initialSecurityState: SecurityState = {
  gesture: null,
  fingerprint: false,
  userLoged: false,
};

export const securityReducer = (state: SecurityState = initialSecurityState, action) => {
  switch (action.type) {
    case SecurityActions.SET_GESTURE:
      return {
        ...state,
        gesture: action.payload,
      };
    case SecurityActions.SET_USER_LOGED:
      return {
        ...state,
        userLoged: action.payload,
      };
    case SecurityActions.ENABLE_FINGERPRINT:
      return {
        ...state,
        fingerprint: action.payload,
      };
    default:
      return state;
  }
};

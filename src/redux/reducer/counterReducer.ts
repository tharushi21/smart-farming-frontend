// src/redux/reducer/counterReducer.ts

// 1. මුලින්ම initial state එකක් හදාගමු
const initialState = {
  value: 0,
};

// 2. සරල reducer එකක් ලියමු
const counterReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, value: state.value + 1 };
    case 'DECREMENT':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

// 3. මේක වැදගත්: default export එක අනිවාර්යයෙන්ම තියෙන්න ඕනේ
export default counterReducer;
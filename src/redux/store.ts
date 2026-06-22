import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../redux/reducer/counterReducer"; // ඔයාගේ රෙඩියුසර් එක මෙතනට import කරන්න

export const store = configureStore({
  reducer: {
    counter: counterReducer, // මෙතන object එකක් විදිහට අනිවාර්යයෙන්ම දාන්න
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
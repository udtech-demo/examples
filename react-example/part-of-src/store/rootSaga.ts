import { fork } from "redux-saga/effects";
import userSaga from "./user/sagas";

export default function* rootSaga() {
  yield fork(userSaga);
}

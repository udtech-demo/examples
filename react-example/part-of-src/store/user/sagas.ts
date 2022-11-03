import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API_ROUTE_PATH } from "";
import { callApi } from "";
import { setInfoModal } from "";
import * as Actions from "./actions";
import ActionTypes, { TUser } from "./types";

function* update(action: ReturnType<typeof Actions.UpdateUser.request>) {
  const { data, callBack, src } = action.payload as Actions.TypUpdateUserR;
  let success = true;
  const sendData = {
    first_name: data.first_name,
    last_name: data.last_name,
    is_profile_picture_changed: data.is_profile_picture_changed,
  };
  const bodyFormData = new FormData();
  bodyFormData.append("file", data.file || "");
  bodyFormData.append("fields", JSON.stringify(sendData));
  try {
    const user = (yield call(callApi, {
      method: "put",
      path: API_ROUTE_PATH.consultants.uMe,
      data: bodyFormData,
    })) as TUser;
    user.profile_picture_url = src;
    yield put(Actions.UpdateUser.success(user));
  } catch (e) {
    yield put(setInfoModal({ title: "Error", mess: e }));
    yield put(Actions.UpdateUser.error(e));
    success = false;
  } finally {
    if (!callBack) return null;
    yield call(callBack, success);
  }
}

function* watchFetchRequest() {
  yield takeEvery(ActionTypes.UPDATE_R, update);
}

export default function* userSaga() {
  yield all([fork(watchFetchRequest)]);
}

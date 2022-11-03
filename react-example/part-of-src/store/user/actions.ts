import { TDefRequest } from "../../types/actions";
import { Actions } from "../utils/Action";
import ActionTypes, { TUser } from "./types";

const UpdateActions = new Actions("UPDATE", ActionTypes);

export interface TypUpdateUserR extends TDefRequest {
  data: {
    first_name: string;
    last_name: string;
    is_profile_picture_changed: boolean;
    file: File | null;
  };
  src: string;
  id: string;
}

export const UpdateUser = {
  request: (payload: TypUpdateUserR) => UpdateActions.request(payload),
  success: (payload: TUser) => UpdateActions.success(payload),
  error: (message: string) => UpdateActions.error(message),
};

export interface TUser {
  profile_picture_url: string;
  email: string;
  created_at: string;
  updated_at: string;
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  workspaces_ids: string[];
  team: {
    id: string;
    created_at: string;
    title: string;
    updated_at: string;
  };
}

export interface TUserState {
  readonly loading: boolean;
  readonly data: TUser | null;
  readonly isLoggedIn: boolean;
  readonly errors?: string | undefined;
}

enum ActionTypes {
  UPDATE_R = "@@user/UPDATE_R",
  UPDATE_S = "@@user/UPDATE_S",
  UPDATE_E = "@@user/UPDATE_E",
}

export default ActionTypes;

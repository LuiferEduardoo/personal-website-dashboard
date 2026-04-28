export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type PasswordChangeRequest = {
  current_password: string;
  new_password: string;
};

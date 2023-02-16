export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResult {
  token: string;
  userGroup: number;
}

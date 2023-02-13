export interface SignInRequest {
  email: string;
  password: string;
}


export interface SignInResult {
  data: {
    token: string;
    userGroup: number;
  };
  status: SignInResultStatus;
  error: string;
}

export enum SignInResultStatus {
  Ok = 0,
  Error = 1
}

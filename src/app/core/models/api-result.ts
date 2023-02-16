export type CommonResult<T> = {
  isSuccessfull: boolean;
  data: T & string;
};

export class ApiResult<T> {
  data: T;
  error: string;
  status: ApiStatus;
}

export enum ApiStatus {
  Ok = 0,
  Error = 1
}

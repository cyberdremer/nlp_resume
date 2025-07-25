export interface SuccessResponse<T> {
  message: T;
  status: number;
}

export interface SuccessfullServerResponse<T = undefined> {
  data: {
    message: string;
    status: number;
    object: T extends undefined ? null : T
  };
}

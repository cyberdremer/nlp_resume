export interface SuccessResponse<T> {
  message: T;
  status: number;
}

export interface SuccessfullServerReponse<T> {
  data: {
    message: string;
    status: number;
    object: T | null;
  };
}

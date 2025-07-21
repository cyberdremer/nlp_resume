class GenericError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, GenericError.prototype);
  }
}


export default GenericError
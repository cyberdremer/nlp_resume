// class GenericError extends Error {
//   status: number;

//   constructor(message: string, status: number) {
//     super(message);
//     this.status = status;
//     Object.setPrototypeOf(this, GenericError.prototype);
//   }
// }

export class BaseError extends Error {
  status: number;
  name: string;

  constructor(messsage: string, status: number = 500) {
    super(messsage);
    this.name = this.constructor.name;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

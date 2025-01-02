export class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.code = 404; 
    }
  }

  export class AlreadyExistsError extends Error {

    constructor(message) {
      super(message);
      this.name = 'AlreadyExistsError';
      this.code = 404; 
    }
  }

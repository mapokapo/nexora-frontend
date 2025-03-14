type AsyncResult<T, E> =
  | {
      loaded: true;
      data: T;
    }
  | {
      loaded: true;
      error: E;
    }
  | {
      loaded: false;
    };

export default AsyncResult;

export function isMongoError(
  err: any,
): err is { message: string; errmsg: string[]; code: number } {
  return (
    typeof err === 'object' &&
    'code' in err &&
    typeof err.code === 'number' &&
    'errmsg' in err &&
    typeof err.errmsg === 'string' &&
    'message' in err &&
    typeof err.message === 'string'
  );
}

import type { APIServerError } from "@api/types";

export function serverErrorsToString(errors: APIServerError) {
  let errorsText = '';
  Object.entries(errors).forEach(([_, v]) => {
    if (typeof v === 'string') {
      errorsText += v;
    } else {
      errorsText += v[0];
    }
  });
  return errorsText;
}

import API from '@api';
import { useMutation } from '@tanstack/react-query';
import type { AuthTokenResponse, APIServerError } from '@api/types';
import { serverErrorsToString } from '@utils/errors';

type AuthCredentials = {
  username: string;
  password: string;
};

function authToken(form: AuthCredentials) {
  return API.Auth.token(form) as Promise<AuthTokenResponse>;
}

export function useAuthToken() {
  return useMutation(authToken, {
    // onError: (error: APIServerError) {
    //   serverErrorsToString(error);
    // }
  });
}

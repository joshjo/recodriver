export interface AuthTokenResponse {
  token: string;
};


export type APIServerError = Object & { [key: string]: string | Array<string> };

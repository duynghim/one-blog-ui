/**
 * @file Defines the types related to authentication.
 */

/**
 * Represents the payload of a decoded JWT.
 */
export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  role: string;
}

/**
 * Represents the data returned from a successful login request.
 */
export interface LoginResponse {
  token: string;
}
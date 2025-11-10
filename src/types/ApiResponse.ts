/**
 * @file Defines the generic ApiResponse type for handling API responses.
 * @author NghiemTD
 */

/**
 * Represents a successful API response.
 * @template T The type of the data payload.
 */
export interface SuccessResponse<T> {
  /**
   * Indicates that the operation was successful.
   */
  success: true;
  /**
   * The data payload of the response.
   */
  data: T;
  /**
   * There is no error in a successful response.
   */
  error: null;
}

/**
 * Represents an error API response.
 */
export interface ErrorResponse {
  /**
   * Indicates that the operation failed.
   */
  success: false;
  /**
   * There is no data in an error response.
   */
  data: null;
  /**
   * The error details.
   */
  error: {
    /**
     * A string representing the error code (e.g., "NOT_FOUND").
     */
    code: string;
    /**
     * A human-readable error description.
     */
    message: string;
  };
}

/**
 * A generic type for API responses that can be either successful or an error.
 * @template T The type of the data payload for a successful response.
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * A type guard to check if a response is a successful response.
 * @param response The response to check.
 * @returns True if the response is a successful response, false otherwise.
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is SuccessResponse<T> {
  return response.success;
}

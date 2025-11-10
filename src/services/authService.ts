import { jwtDecode } from "jwt-decode";
import type { ApiResponse, DecodedToken, LoginResponse } from "@/types";
import Cookies from "js-cookie";
import apiService from "./apiService";
const TOKEN_KEY = "jwt";

const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
};

const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

function getDecodedToken(): DecodedToken | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

function isTokenExpired(): boolean {
  const decodedToken = getDecodedToken();
  if (!decodedToken) return true;

  const now = Date.now() / 1000;
  return decodedToken.exp < now;
}

async function login(
  username: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  const response = await apiService.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    { username, password },
  );
  console.log('Calling login API...');
  console.log('Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log("login response:", response);
  if (response.success && response.data?.token) {
    setToken(response.data.token);
  }
  return response;
}

function logout(): void {
  removeToken();
}

export const authService = {
  setToken,
  getToken,
  removeToken,
  getDecodedToken,
  isTokenExpired,
  login,
  logout,
};

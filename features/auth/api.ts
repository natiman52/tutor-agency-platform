import { api } from "@/lib/api/axios";
import {
  LoginPayload, RegisterPayload,
  AuthResponse, PasswordResetPayload,
  VerifyOtpPayload, CompleteSignupPayload
} from "./types";

import { User } from '../../types';

// 📍 Session Management
export const getCurrentUser = () =>
  api.get<User>("/api/auth/user/");

export const loginRequest = (data: LoginPayload) =>
  api.post("/api/auth/login/", data);

export const logoutRequest = () =>
  api.post("/api/auth/logout/");

export const refreshTokenRequest = () =>
  api.post("/api/auth/token/refresh/");

export const googleLoginRequest = (accessToken: string) =>
  api.post("/api/auth/google/", { access_token: accessToken });

// 📍 Account & Security
export const registerRequest = (data: RegisterPayload) =>
  api.post("/api/auth/registration/", data);

export const completeSignupRequest = (data: CompleteSignupPayload) =>
  api.post("/api/auth/finish-signup/", data);

export const resetPasswordRequest = (email: string) =>
  api.post("/api/auth/password/reset/", { email });

export const verifyResetRequest = (data: any) =>
  api.post("/api/auth/password/reset/verify/", data);

export const changePasswordRequest = (data: any) =>
  api.post("/api/auth/changepassword/", data);

export const verifyOtpRequest = (data: VerifyOtpPayload) =>
  api.post("/api/auth/verifyotp", data);

export const resendOtpRequest = () =>
  api.post("/api/auth/resend-otp/");
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginRequest, registerRequest,
  verifyOtpRequest, completeSignupRequest,
  getCurrentUser, logoutRequest, resendOtpRequest
} from "./api";
import { useAuthStore } from "@/store/authStore";
import {
  LoginPayload, RegisterPayload,
  VerifyOtpPayload, CompleteSignupPayload
} from "./types";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginPayload) => loginRequest(data),
    onSuccess: (res) => {
      setUser(res.data.user);
    },
  });
};

export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: RegisterPayload) => registerRequest(data),
    onSuccess: (res) => {
      if (res.data.user) {
        setUser(res.data.user);
      }
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => verifyOtpRequest(data),
  });
};

export const useCompleteSignup = () => {
  return useMutation({
    mutationFn: (data: CompleteSignupPayload) => completeSignupRequest(data),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtpRequest,
  });
};

export const useCurrentUser = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
        return res.data;
      } catch (err) {
        setUser(null);
        throw err;
      }
    },
    retry: false, // Don't spam the server if the user is just a guest
    staleTime: 1000 * 60 * 5, // Keep session valid in cache for 5 mins
  });
};

export const useLogout = () => {
  const navigate = useNavigate()
  const logoutState = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      console.log('tets')
      logoutState();
      // queryClient.clear();  Nuclear option: remove everything from cache
      navigate("/")
    },
  });
};
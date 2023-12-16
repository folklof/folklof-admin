import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import axios from "axios";

import { Typography, CircularProgress } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useQuery } from "react-query";
import { styled } from "@mui/system";
import API_URL from "../../utils/API_URL";

const SuccessContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const SuccessAnimation = styled(CheckCircle)({
  fontSize: 48,
  color: "green",
});

const AuthPage = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, data, error } = useQuery(
    "userProfile",
    async () => {
      const getAccess = await axios.get(`${API_URL}/dashboard/admin`, {
        withCredentials: true,
      });
      if (getAccess.status === 200) {
        const response = await axios.get(`${API_URL}/users/profile`, {
          withCredentials: true,
        });
        const userData = response.data.data;
        console.log(userData);
        dispatch(setUser(userData));
        return userData;
      } else {
        throw new Error("Unauthorized");
      }
    }
  );

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    } else if (isError) {
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  }, [data, isError, isLoading]);

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
        <Typography variant="h4">Verifying Your Account...</Typography>
      </div>
    );
  }

  if (isError && error.response.status === 401) {
    return (
      <div>
        <Typography variant="h4">You're not Admin</Typography>
        <Typography variant="subtitle1">
          Redirecting to login page soon...
        </Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Typography variant="h4">Failed to fetch data</Typography>
        <Typography variant="subtitle1">
          {error.message}. Redirecting to login page soon...
        </Typography>
      </div>
    );
  }
  return (
    <SuccessContainer>
      <SuccessAnimation />
      <Typography variant="h4">User Authenticated!</Typography>
      <Typography variant="subtitle1">
        Redirecting to dashboard soon...
      </Typography>
    </SuccessContainer>
  );
};

export default AuthPage;

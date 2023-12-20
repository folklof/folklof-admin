import React from "react";
import kanbanBoard from "../../assets/kanban.avif";
import API_URL from "../../utils/API_URL";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { FcGoogle } from "react-icons/fc";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../Logo";
import style from "./loginPage.module.css";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Folklof
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function LoginPageComponent() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    window.location.href = `${API_URL}/auth/login`;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100%", width: "100%" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${kanbanBoard}), linear-gradient(rgb(20, 13, 27), rgba(0, 0, 0, 1))`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "dark",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Logo className={style.logo} />
            <Typography component="h1" variant="h6">
              Admin Panel
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                onClick={handleSubmit}
                sx={{ mt: 5, mb: 2 }}
                startIcon={<FcGoogle />}
              >
                Sign in with Google
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

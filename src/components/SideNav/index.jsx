import * as React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

import Dashboard from "../Dashboard";
import GenerateBookPage from "../GenerateBookPage";
import UserManagement from "../UserManagement";
import ProfileSetting from "../ProfileSetting";

// MUI Components
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BookIcon from "@mui/icons-material/Book";
import QuizIcon from "@mui/icons-material/Quiz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [menuData, setMenuData] = React.useState("Dashboard");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (text) => {
    setMenuData(text);
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    window.location.href = "/";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Folklof Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            key={"Dashboard"}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleListItemClick("Dashboard")}
          >
            <Tooltip title="Dashboard" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Dashboard"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem
            key={"Generate Book"}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleListItemClick("Generate Book")}
          >
            <Tooltip title="Generate Book" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <BookIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Generate book"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem
            key={"Create Quiz"}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleListItemClick("Create Quiz")}
          >
            <Tooltip title="Create Quiz" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Create Quiz"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem
            key={"History Quiz"}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleListItemClick("History Quiz")}
          >
            <Tooltip title="History Quiz" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"History Quiz"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        <Divider />
        <List>
          <ListItem
            key={"User Management"}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleListItemClick("User Management")}
          >
            <Tooltip title="User Management" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"User Management"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem
            key={"Profile Setting"}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleListItemClick("Profile Setting")}
          >
            <Tooltip title="Profile Setting" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Profile Setting"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem
            key={"Log Out"}
            disablePadding
            sx={{ display: "block" }}
            onClick={handleLogout}
          >
            <Tooltip title="Log Out" placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Log Out"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {menuData === "Dashboard" && <Dashboard />}
        {menuData === "Generate Book" && <GenerateBookPage />}
        {menuData === "User Management" && <UserManagement />}
        {menuData === "Profile Setting" && <ProfileSetting />}
      </Box>
    </Box>
  );
}

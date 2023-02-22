import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import styles from "./header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  loginPath,
  versionsPath,
  singUpPath,
  timelinePath,
} from "@/utils/urls/client";
import { fetchLogout } from "@/features/auth";
import { logoutSuccess } from "@/redux/reducers/auth";
import ConfirmationModal from "../confirmationModal";
import Notifications from "./notifications";
const Header = () => {
  const { isLoggedIn, currentUser } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { pathname } = useRouter();
  const dispatch = useDispatch();
  type MenuItems = { name: string; path: string }[];
  const appItems = [
    { name: "作品一覧", path: versionsPath },
    { name: "タイムライン", path: timelinePath },
  ];
  const [menuItems, setMenuItems] = useState<MenuItems | undefined>(appItems);
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     setMenuItems(appItems);
  //   } else {
  //     setMenuItems(undefined);
  //   }
  // }, [isLoggedIn]);

  const settings = ["Logout"];
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (tgtPath?: string) => {
    pathname !== tgtPath && tgtPath && Router.push(tgtPath);
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [open, setOpen] = useState(false);
  const handleLogoutModalOpen = () => {
    setOpen(true);
  };
  const handleLogoutModalClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await fetchLogout();
    dispatch(logoutSuccess());
    handleLogoutModalClose();
    Router.push(loginPath);
  };

  return (
    <div className={styles.headerWrapper}>
      <ConfirmationModal
        handleClose={handleLogoutModalClose}
        confirmationTxt="ログアウトしますか？"
        execFunc={handleLogout}
        open={open}
      />
      <AppBar
        position="static"
        style={{ backgroundColor: "red" }}
        className={styles.header}
      >
        <div className={styles.headerWrapper}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Poke Line
              </Typography>
              {isLoggedIn && (
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={() => handleCloseNavMenu()}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    {appItems
                      ?.filter((item) => item.path !== pathname)
                      .map((item, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => handleCloseNavMenu(item.path)}
                        >
                          <Typography textAlign="center">
                            {item.name}
                          </Typography>
                        </MenuItem>
                      ))}
                  </Menu>
                </Box>
              )}
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Poke Line
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {appItems?.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => handleCloseNavMenu(item.path)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
              {isLoggedIn && currentUser ? (
                <>
                  <Notifications />
                  <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open menu">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt="dummy" src={currentUser?.picture} />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                          <Typography
                            textAlign="center"
                            onClick={handleLogoutModalOpen}
                          >
                            {setting}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{ display: { xs: "flex", md: "flex" } }}
                  className={styles.buttons}
                >
                  {pathname !== loginPath && (
                    <Button onClick={() => Router.push(loginPath)}>
                      ログイン
                    </Button>
                  )}
                  {pathname !== singUpPath && (
                    <Button onClick={() => Router.push(singUpPath)}>
                      サインアップ
                    </Button>
                  )}
                </Box>
              )}
            </Toolbar>
          </Container>
        </div>
      </AppBar>
    </div>
  );
};

export default Header;

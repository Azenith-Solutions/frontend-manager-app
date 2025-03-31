import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import Logo from "../../assets/Logo.svg";

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acessar a rota atual
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    const wantsToLogout = window.confirm("Você realmente deseja sair?");
    if (wantsToLogout) {
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    }
  };

  const menuItems = [
    { text: "Gerenciamento", icon: <DashboardIcon />, path: "/gerenciamento" },
    { text: "Pedidos", icon: <PeopleIcon />, path: "/pedidos" },
    { text: "Relatórios e Análise", icon: <AnalyticsIcon />, path: "/analise" },
    { text: "Suporte", icon: <SettingsIcon />, path: "/suporte" }
  ];

  // Define o título com base na rota atual
  const getPageTitle = () => {
    const currentRoute = menuItems.find((item) => item.path === location.pathname);
    return currentRoute ? currentRoute.text : "Página Desconhecida";
  };

const drawer = (
    <div>
        <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
            <img src={Logo} alt="Logo" style={{ width: "260px", height: "auto" }} />
        </Toolbar>
        <Divider />
        <List>
            {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                    <ListItemButton
                        onClick={() => {
                            navigate(item.path);
                            if (isMobile) setMobileOpen(false);
                        }}
                        sx={{
                            color: "#61131A", 
                            "&:hover": {
                                backgroundColor: "#8B1E26", 
                                color: "#FFFFFF", 
                                transition: "background-color 0.3s, color 0.3s" 
                            }
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: "inherit" 
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        <Divider />
        <List>
            <ListItem disablePadding>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        color: "#61131A", // Default text color
                        "&:hover": {
                            backgroundColor: "#8B1E26", // Slightly lighter background color
                            color: "#FFFFFF", // White text on hover
                            transition: "background-color 0.3s, color 0.3s" // Smooth transition
                        }
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color: "inherit" // Inherit color for the icon
                        }}
                    >
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </ListItem>
        </List>
    </div>
);

return (
    <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                backgroundColor: "#61131A" // Define a cor da barra
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
                    {getPageTitle()}
                </Typography>
            </Toolbar>
        </AppBar>
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                marginTop: { xs: "56px", sm: "64px" }
            }}
        >
            <Outlet />
        </Box>
    </Box>
);
};

export default Layout;

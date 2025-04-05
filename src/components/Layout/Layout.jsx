import React, { useState } from "react";
import './Layout.css';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    AppBar,
    Box,
    CssBaseline,
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
    Logout as LogoutIcon,
    Menu as MenuIcon
} from "@mui/icons-material";

// icons
import Logo from "../../assets/Logo.svg";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; 
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'; 

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    const redAndWhiteIcons = {
        dashboard: { 
            red: <DashboardOutlinedIcon sx={{ color: "#61131A" }} />, 
            white: <DashboardOutlinedIcon sx={{ color: "#FFFFFF" }} />
        },
        management: { 
            red: <ManageSearchOutlinedIcon  sx={{ color: "#61131A" }} />, 
            white: <ManageSearchOutlinedIcon  sx={{ color: "#FFFFFF" }} />
        },
        order: { 
            red: <ShoppingCartOutlinedIcon sx={{ color: "#61131A" }} />, 
            white: <ShoppingCartOutlinedIcon sx={{ color: "#FFFFFF" }} />
        },
        report: { 
            red: <BarChartOutlinedIcon sx={{ color: "#61131A" }} />, 
            white: <BarChartOutlinedIcon sx={{ color: "#FFFFFF" }} />
        },
    };

    const menuItems = [
        { text: "Dashboard", key: "dashboard", path: "/dashboard" },
        { text: "Gerenciamento", key: "management", path: "/gerenciamento" },
        { text: "Pedidos", key: "order", path: "/pedidos" },
        { text: "Relatórios e Análise", key: "report", path: "/analise" },
    ];

    // Define o título com base na rota atual
    const getPageTitle = () => {
        const currentRoute = menuItems.find((item) => item.path === location.pathname);
        return currentRoute ? currentRoute.text : "Página Desconhecida";
    };

    const [hoveredItem, setHoveredItem] = useState(null);

    const drawer = (
        <>
            <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
                <img src={Logo} alt="Logo" style={{ width: "260px", height: "auto" }} />
            </Toolbar>
            <List sx={{
                marginTop: "80px",
                marginBottom: "120px",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {menuItems.map((item) => {
                    const iconSrc = hoveredItem === item.key ? redAndWhiteIcons[item.key].white : redAndWhiteIcons[item.key].red;

                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                onMouseEnter={() => setHoveredItem(item.key)}
                                onMouseLeave={() => setHoveredItem(null)}
                                sx={{
                                    color: "#61131A",
                                    paddingLeft: 3.3,
                                    height: 54,
                                    "&:hover": {
                                        backgroundColor: "#8B1E26",
                                        color: "#FFFFFF",
                                        transition: "background-color 0.3s, color 0.3s",
                                    },
                                }}
                            >
                                    <ListItemIcon
                                        sx={{
                                                minWidth: 30,
                                                color: "inherit",
                                            }}
                                        >
                                        {iconSrc}
                                    </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
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
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            gap: "2px"
                        }}>
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "inherit", // Inherit color for the icon
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText sx={{
                                flex: "none",
                                textAlign: "center",
                            }} primary="Logout" />
                        </div>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
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

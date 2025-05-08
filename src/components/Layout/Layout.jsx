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
    useTheme,
    Collapse
} from "@mui/material";

import {
    Logout as LogoutIcon,
    Menu as MenuIcon,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";

// icons
import Logo from "../../assets/Logo.svg";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; 
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'; 
import PsychologyIcon from '@mui/icons-material/Psychology';
import PeopleIcon from '@mui/icons-material/People';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import SettingsIcon from '@mui/icons-material/Settings';
import MemoryIcon from '@mui/icons-material/Memory';



const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);

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
            red: <SettingsIcon sx={{ color: "#61131A" }} />,
            white: <SettingsIcon sx={{ color: "#FFFFFF" }} />
        },
        components: { 
            red: <MemoryIcon sx={{ color: "#61131A" }} />, 
            white: <MemoryIcon sx={{ color: "#FFFFFF" }} />
        },
        order: { 
            red: <ShoppingCartOutlinedIcon sx={{ color: "#61131A" }} />, 
            white: <ShoppingCartOutlinedIcon sx={{ color: "#FFFFFF" }} />
        },
        users: { 
            red: <PeopleIcon sx={{ color: "#61131A" }} />, 
            white: <PeopleIcon sx={{ color: "#FFFFFF" }} />
        },
        report: { 
            red: <BarChartOutlinedIcon sx={{ color: "#61131A" }} />, 
            white: <BarChartOutlinedIcon sx={{ color: "#FFFFFF" }} />
        },
        assistentIa: { 
            red: <PsychologyIcon sx={{ color: "#61131A" }} />, 
            white: <PsychologyIcon sx={{ color: "#FFFFFF" }} />
        },
        suport: { 
            red: <HeadsetMicIcon sx={{ color: "#61131A" }} />, 
            white: <HeadsetMicIcon sx={{ color: "#FFFFFF" }} />
        },
    };

    const menuItems = [
        { text: "Dashboard", key: "dashboard", path: "/dashboard" },
        { 
            text: "Gerenciamento", 
            key: "management", 
            isExpandable: true,
            subItems: [
                { text: "Componentes", key: "components", path: "/componentes" },
                { text: "Pedidos", key: "order", path: "/pedidos" },
                { text: "Usuários", key: "users", path: "/usuarios" }
            ]
        },
        { text: "Relatórios e Análise", key: "report", path: "/analise" },
        { text: "Assistente IA", key: "assistentIa", path: "/assistente-ia" },
        { text: "Suporte", key: "suport", path: "/suporte" },
    ];

    // Define o título com base na rota atual
    const getPageTitle = () => {
        // Verificar primeiro nos itens principais
        const currentRoute = menuItems.find((item) => item.path === location.pathname);
        if (currentRoute) {
            return currentRoute.text;
        }
        
        // Se não encontrar nos itens principais, procurar nos subitens
        for (const item of menuItems) {
            if (item.subItems) {
                const subItem = item.subItems.find(sub => sub.path === location.pathname);
                if (subItem) {
                    return subItem.text;
                }
            }
        }
        
        return "Página Desconhecida";
    };

    const [hoveredItem, setHoveredItem] = useState(null);

    const drawer = (
        <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                py: 2,
                height: 200,
                mb: 0,
                }}>
                <img src={Logo} alt="Logo" style={{  }} />
            </Toolbar>
            <List sx={{
                marginTop: 0,
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
            }}>
                {menuItems.map((item) => {
                    // Verificar se o item atual ou algum de seus subitens está ativo
                    const isActive = location.pathname === item.path;
                    const hasActiveSubItem = item.subItems?.some(sub => location.pathname === sub.path);
                    
                    // Determinar qual ícone mostrar
                    const iconColor = (isActive || hasActiveSubItem || hoveredItem === item.key) ? 'white' : 'red';
                    const iconSrc = redAndWhiteIcons[item.key][iconColor];
                    
                    return (
                        <React.Fragment key={item.text}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        if (item.isExpandable) {
                                            setManagementOpen(!managementOpen);
                                        } else {
                                            navigate(item.path);
                                            if (isMobile) setMobileOpen(false);
                                        }
                                    }}
                                    onMouseEnter={() => setHoveredItem(item.key)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    sx={{
                                        color: (isActive || hasActiveSubItem) ? "#FFFFFF" : "#61131A",
                                        paddingLeft: 3.3,
                                        height: 54,
                                        backgroundColor: (isActive || hasActiveSubItem) ? "#8B1E26" : "transparent",
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
                                    {item.isExpandable && (
                                        managementOpen ? <ExpandLess /> : <ExpandMore />
                                    )}
                                </ListItemButton>
                            </ListItem>
                            
                            {/* Renderizar subitens caso o item seja expandível */}
                            {item.isExpandable && (
                                <Collapse in={managementOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem) => {
                                            const isSubActive = location.pathname === subItem.path;
                                            const subIconColor = isSubActive || hoveredItem === subItem.key ? 'white' : 'red';
                                            const subIconSrc = redAndWhiteIcons[subItem.key][subIconColor];
                                            
                                            return (
                                                <ListItem key={subItem.text} disablePadding>
                                                    <ListItemButton
                                                        onClick={() => {
                                                            navigate(subItem.path);
                                                            if (isMobile) setMobileOpen(false);
                                                        }}
                                                        onMouseEnter={() => setHoveredItem(subItem.key)}
                                                        onMouseLeave={() => setHoveredItem(null)}
                                                        sx={{
                                                            color: isSubActive ? "#FFFFFF" : "#61131A",
                                                            paddingLeft: 6,
                                                            height: 48,
                                                            backgroundColor: isSubActive ? "#8B1E26" : "transparent",
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
                                                            {subIconSrc}
                                                        </ListItemIcon>
                                                        <ListItemText primary={subItem.text} />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    );
                })}
            </List>
            <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                bgcolor: 'background.paper',
                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                overflow: 'hidden'
            }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                color: "#61131A",
                                transition: "all 0.3s",
                                "&:hover": {
                                    backgroundColor: "transparent"
                                }
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                gap: "8px",
                                transition: "transform 0.3s",
                            }}
                            className="logout-container"
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "inherit",
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
            </Box>
        </Box>
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

// import React, { useState } from "react";
// import './Layout.css';
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import {
//     AppBar,
//     Box,
//     CssBaseline,
//     Drawer,
//     IconButton,
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemIcon,
//     ListItemText,
//     Toolbar,
//     Typography,
//     useMediaQuery,
//     useTheme
// } from "@mui/material";
// import {
//     Logout as LogoutIcon,
//     Menu as MenuIcon
// } from "@mui/icons-material";
// import Logo from "../../assets/Logo.svg";
// import WhiteManagementIcon from "../../assets/icons/white-management-icon.svg";
// import WhiteOrderIcon from "../../assets/icons/white-order-icon.svg";
// import WhiteReportIcon from "../../assets/icons/white-report-icon.svg";
// import RedManagementIcon from "../../assets/icons/red-management-icon.svg";
// import RedOrderIcon from "../../assets/icons/red-order-icon.svg";
// import RedReportIcon from "../../assets/icons/red-report-icon.svg";

// const drawerWidth = 240;

// const Layout = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [hoveredItem, setHoveredItem] = useState(null);
//     // const [itemClicked, setItemClicked] = useState(null);

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     const handleLogout = () => {
//         const wantsToLogout = window.confirm("Você realmente deseja sair?");
//         if (wantsToLogout) {
//             localStorage.removeItem("isLoggedIn");
//             navigate("/");
//         }
//     };

//     const redAndWhiteIcons = {
//         management: { red: RedManagementIcon, white: WhiteManagementIcon },
//         order: { red: RedOrderIcon, white: WhiteOrderIcon },
//         report: { red: RedReportIcon, white: WhiteReportIcon },
//     };

//     const menuItems = [
//         { text: "Gerenciamento de Estoque", key: "management", path: "/gerenciamento" },
//         { text: "Dashboard", key: "dashboard", path: "/dashboard" },
//         { text: "Gerenciamento", key: "management", path: "/gerenciamento" },
//         { text: "Pedidos", key: "order", path: "/pedidos" },
//         { text: "Relatórios e Análise", key: "report", path: "/analise" },
//     ];

//     // Define o título com base na rota atual
//     const getPageTitle = () => {
//         const currentRoute = menuItems.find((item) => item.path === location.pathname);
//         return currentRoute ? currentRoute.text : "Página Desconhecida";
//     };

//     const drawer = (
//         <>
//             <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
//                 <img src={Logo} alt="Logo" style={{ width: "260px", height: "auto" }} />
//             </Toolbar>
//             <List sx={{
//                 marginTop: "80px",
//                 marginBottom: "120px",
//                 justifyContent: "center",
//                 alignItems: "center"
//             }}>
//                 {menuItems.map((item) => {
//                     const iconSrc = hoveredItem === item.key ? redAndWhiteIcons[item.key].white : redAndWhiteIcons[item.key].red;

//                     return (
//                         <ListItem key={item.text} disablePadding>
//                             <ListItemButton
//                                 onClick={() => {
//                                     navigate(item.path);
//                                     if (isMobile) setMobileOpen(false);
//                                     // setItemClicked(item.key);
//                                 }}
//                                 onMouseEnter={() => setHoveredItem(item.key)}
//                                 onMouseLeave={() => setHoveredItem(null)}
//                                 sx={{
//                                     color: "#61131A",
//                                     paddingLeft: 3.3,
//                                     height: 54,
//                                     "&:hover": {
//                                         backgroundColor: "#8B1E26",
//                                         color: "#FFFFFF",
//                                         transition: "background-color 0.3s, color 0.3s",
//                                     },
//                                 }}
//                             >
//                                 <ListItemIcon
//                                     sx={{
//                                         minWidth: 30,
//                                         color: "inherit",
//                                     }}
//                                 >
//                                     <img src={iconSrc} alt={`${item.text} icon`} style={{ marginRight: 8 }} />
//                                 </ListItemIcon>
//                                 <ListItemText primary={item.text} />
//                             </ListItemButton>
//                         </ListItem>
//                     );
//                 })}
//             </List>
//             <List>
//                 <ListItem disablePadding>
//                     <ListItemButton
//                         onClick={handleLogout}
//                         sx={{
//                             color: "#61131A", // Default text color
//                             "&:hover": {
//                                 backgroundColor: "#8B1E26", // Slightly lighter background color
//                                 color: "#FFFFFF", // White text on hover
//                                 transition: "background-color 0.3s, color 0.3s" // Smooth transition
//                             }
//                         }}
//                     >
//                         <div style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             width: "100%",
//                             gap: "2px"
//                         }}>
//                             <ListItemIcon
//                                 sx={{
//                                     minWidth: 0,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     color: "inherit", // Inherit color for the icon
//                                 }}
//                             >
//                                 <LogoutIcon />
//                             </ListItemIcon>
//                             <ListItemText sx={{
//                                 flex: "none",
//                                 textAlign: "center",
//                             }} primary="Logout" />
//                         </div>
//                     </ListItemButton>
//                 </ListItem>
//             </List>
//         </>
//     );

//     return (
//         <Box sx={{ display: "flex" }}>
//             <CssBaseline />
//             <AppBar
//                 position="fixed"
//                 sx={{
//                     width: { sm: `calc(100% - ${drawerWidth}px)` },
//                     ml: { sm: `${drawerWidth}px` },
//                     height: "82px",
//                     justifyContent: "center",
//                     backgroundColor: "#61131A" // Define a cor da barra
//                 }}
//             >
//                 <Toolbar>
//                     <IconButton
//                         color="inherit"
//                         aria-label="open drawer"
//                         edge="start"
//                         onClick={handleDrawerToggle}
//                         sx={{ mr: 2, display: { sm: "none" } }}
//                     >
//                         <MenuIcon />
//                     </IconButton>
//                     <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
//                         {getPageTitle()}
//                     </Typography>
//                 </Toolbar>
//             </AppBar>
//             <Box
//                 component="nav"
//                 sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//                 aria-label="mailbox folders"
//             >
//                 <Drawer
//                     variant="temporary"
//                     open={mobileOpen}
//                     onClose={handleDrawerToggle}
//                     ModalProps={{
//                         keepMounted: true
//                     }}
//                     sx={{
//                         display: { xs: "block", sm: "none" },
//                         "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
//                     }}
//                 >
//                     {drawer}
//                 </Drawer>
//                 <Drawer
//                     variant="permanent"
//                     sx={{
//                         display: { xs: "none", sm: "block" },
//                         "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
//                     }}
//                     open
//                 >
//                     {drawer}
//                 </Drawer>
//             </Box>
//             <Box
//                 component="main"
//                 sx={{
//                     flexGrow: 1,
//                     p: 3,
//                     width: { sm: `calc(100% - ${drawerWidth}px)` },
//                     marginTop: { xs: "56px", sm: "64px" }
//                 }}
//             >
//                 <Outlet />
//             </Box>
//         </Box>
//     );
// };

// export default Layout;

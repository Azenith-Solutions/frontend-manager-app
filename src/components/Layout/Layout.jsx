import React, { useState } from "react";
import './Layout.css';
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// Standardized avatar URL
const STANDARD_AVATAR = "https://ui-avatars.com/api/?background=61131A&color=fff&bold=true&font-size=0.33&name=";

// Function to format name for avatar (first letter of first and last name)
const formatNameForAvatar = (fullName) => {
    if (!fullName) return "";
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
};

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
    Collapse,
    Tooltip,
    Avatar,
    InputBase,
    Popper,
    Paper,
    ClickAwayListener,
    List as MuiList,
    ListItemButton as MuiListItemButton
} from "@mui/material";

import {
    Logout as LogoutIcon,
    Menu as MenuIcon,
    ExpandLess,
    ExpandMore,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ArrowBackIosNew as ArrowBackIosNewIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
    NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
    MailOutlineOutlined as MailOutlineOutlinedIcon,
    Search as SearchIcon
} from "@mui/icons-material";

import { alpha } from '@mui/material/styles';

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



const EXPANDED_DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 65;

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const user = localStorage.getItem("user").replace(/"/g, "");
    const userInitials = formatNameForAvatar(user);
    const userRole = localStorage.getItem("role");

    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [managementOpen, setManagementOpen] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);
    const searchInputRef = React.useRef(null);

    const drawerWidth = sidebarExpanded ? EXPANDED_DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH;


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
                // Only show Usuários if not Gestor do Estoque
                ...(userRole !== "Gestor do Estoque" ? [{ text: "Usuários", key: "users", path: "/usuarios" }] : [])
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

    const handleToggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.trim() === "") {
            setSearchResults([]);
            setSearchAnchorEl(null);
            return;
        }

        const filteredResults = [];
        menuItems.forEach(item => {
            if (item.text.toLowerCase().includes(term.toLowerCase())) {
                if (item.path) { // Only add if it's a navigable item
                    filteredResults.push({ text: item.text, path: item.path, originalText: item.text });
                }
            }
            if (item.subItems) {
                item.subItems.forEach(subItem => {
                    if (subItem.text.toLowerCase().includes(term.toLowerCase())) {
                        filteredResults.push({ text: subItem.text, path: subItem.path, originalText: subItem.text });
                    }
                });
            }
        });
        setSearchResults(filteredResults);
        setSearchAnchorEl(event.currentTarget);
    };

    const handleSearchResultClick = (path) => {
        navigate(path);
        setSearchTerm("");
        setSearchResults([]);
        setSearchAnchorEl(null);
        if (isMobile) setMobileOpen(false);
    };

    const handleSearchFocus = (event) => {
        if (searchTerm.trim() !== "" && searchResults.length > 0) {
            setSearchAnchorEl(event.currentTarget);
        }
    };

    const handleClickAwaySearch = () => {
        setSearchAnchorEl(null);
    };

    const drawer = (
        <Box sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: theme.transitions.create(['width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }}>
            <Toolbar sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 1.5,
                height: 'auto',
                mb: 1,
            }}>
                <img
                    src={Logo}
                    alt="Logo"
                    style={{
                        display: sidebarExpanded ? 'flex' : 'none',
                        maxWidth: sidebarExpanded ? '100%' : '70%',
                        height: 'auto',
                        transition: 'max-width 0.3s, margin-top 0.3s',
                        minWidth: sidebarExpanded ? 'auto' : '50px',
                        marginTop: sidebarExpanded ? 0 : '50px',
                    }}
                />
            </Toolbar>

            <IconButton
                onClick={handleToggleSidebar}
                sx={{
                    position: 'absolute',
                    right: 20,
                    top: 20,
                    zIndex: 1200,
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)',
                    }
                }}
            >
                {sidebarExpanded ? <ArrowBackIosNewIcon sx={{ fontSize: '0.8rem' }} /> : <ArrowForwardIosIcon sx={{ fontSize: '0.8rem' }} />}
            </IconButton>

            <List sx={{
                marginTop: 0,
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                '& .MuiTypography-root': {
                    fontSize: '0.95rem',
                    fontWeight: 500
                },
                '& .MuiSvgIcon-root': {
                    fontSize: '1.35rem'
                }
            }}>
                {menuItems.map((item) => {
                    // Verificar se o item atual ou algum de seus subitens está ativo
                    const isActive = location.pathname === item.path;
                    const hasActiveSubItem = item.subItems?.some(sub => location.pathname === sub.path);

                    // Determinar qual ícone mostrar
                    const iconColor = (isActive || hasActiveSubItem || hoveredItem === item.key) ? 'white' : 'red';
                    const iconSrc = redAndWhiteIcons[item.key][iconColor];

                    const listItem = (
                        <ListItemButton
                            onClick={() => {
                                if (item.isExpandable) {
                                    if (sidebarExpanded) {
                                        setManagementOpen(!managementOpen);
                                    } else {
                                        setSidebarExpanded(true);
                                        setManagementOpen(true);
                                    }
                                } else {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }
                            }}
                            onMouseEnter={() => setHoveredItem(item.key)}
                            onMouseLeave={() => setHoveredItem(null)}
                            sx={{
                                color: (isActive || hasActiveSubItem) ? "#FFFFFF" : "#61131A",
                                paddingLeft: sidebarExpanded ? 2 : 0,
                                paddingRight: 1,
                                height: 42,
                                backgroundColor: (isActive || hasActiveSubItem) ? "#8B1E26" : "transparent",
                                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                                "&:hover": {
                                    backgroundColor: "#8B1E26",
                                    color: "#FFFFFF",
                                    transition: "background-color 0.3s, color 0.3s",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: sidebarExpanded ? 35 : 0,
                                    color: "inherit",
                                    mr: sidebarExpanded ? 0 : 'auto',
                                    ml: sidebarExpanded ? 0 : 'auto',
                                    pl: sidebarExpanded ? 0 : 0, // Added left padding when collapsed
                                }}
                            >
                                {iconSrc}
                            </ListItemIcon>
                            {sidebarExpanded && <ListItemText primary={item.text} />}
                            {sidebarExpanded && item.isExpandable && (
                                managementOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />
                            )}
                        </ListItemButton>
                    );

                    return (
                        <React.Fragment key={item.text}>
                            <ListItem disablePadding>
                                {sidebarExpanded ?
                                    listItem :
                                    <Tooltip title={item.text} placement="right">
                                        {listItem}
                                    </Tooltip>
                                }
                            </ListItem>

                            {/* Renderizar subitens caso o item seja expandível */}
                            {item.isExpandable && sidebarExpanded && (
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
                                                            paddingLeft: 4.5,
                                                            paddingRight: 1,
                                                            height: 38,
                                                            backgroundColor: isSubActive ? "#8B1E26" : "transparent",
                                                            "&:hover": {
                                                                backgroundColor: "#8B1E26",
                                                                color: "#FFFFFF",
                                                                transition: "background-color 0.3s, color 0.3s",
                                                            },
                                                            '& .MuiTypography-root': {
                                                                fontSize: '0.85rem'
                                                            },
                                                        }}
                                                    >
                                                        <ListItemIcon
                                                            sx={{
                                                                minWidth: 30,
                                                                color: "inherit",
                                                                pl: sidebarExpanded ? 0 : '10px', // Added left padding when collapseds
                                                            }} m
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
                                height: 40,
                                transition: "all 0.3s",
                                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                                "&:hover": {
                                    backgroundColor: "transparent"
                                }
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: sidebarExpanded ? "100%" : "auto",
                                gap: sidebarExpanded ? "8px" : "0",
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
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                {sidebarExpanded && (
                                    <ListItemText sx={{
                                        flex: "none",
                                        textAlign: "center",
                                        '& .MuiTypography-root': {
                                            fontSize: '0.9rem',
                                            fontWeight: 500
                                        }
                                    }} primary="Logout" />
                                )}
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
                    backgroundColor: "#61131A",
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
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
                    <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {getPageTitle()}
                    </Typography>
                    <ClickAwayListener onClickAway={handleClickAwaySearch}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {/* Search Bar */}
                            <Box sx={{
                                position: 'relative',
                                borderRadius: theme.shape.borderRadius,
                                backgroundColor: alpha(theme.palette.common.white, 0.15),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.common.white, 0.25),
                                },
                                marginRight: theme.spacing(2),
                                marginLeft: 0,
                                width: 'auto',
                                display: { xs: 'none', sm: 'flex' }
                            }}>
                                <Box sx={{ padding: theme.spacing(0, 1), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SearchIcon />
                                </Box>
                                <InputBase
                                    id="global-search-input"
                                    placeholder="Pesquisar…"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    ref={searchInputRef}
                                    sx={{
                                        color: 'inherit',
                                        '& .MuiInputBase-input': {
                                            padding: theme.spacing(1, 1, 1, 0),
                                            paddingLeft: `calc(1em + ${theme.spacing(3)})`,
                                            transition: theme.transitions.create('width'),
                                            width: '15ch',
                                            '&:focus': {
                                                width: '25ch',
                                            },
                                        },
                                    }}
                                />
                                <Popper
                                    open={Boolean(searchAnchorEl && searchResults.length > 0)}
                                    anchorEl={searchAnchorEl}
                                    placement="bottom-start"
                                    modifiers={[
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 8], // Add some offset from the anchor
                                            },
                                        },
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                boundary: 'viewport',
                                            },
                                        }
                                    ]}
                                    sx={{ zIndex: theme.zIndex.modal + 1, width: searchInputRef.current ? searchInputRef.current.offsetWidth : 'auto' }}
                                >
                                    <Paper elevation={3} sx={{ maxHeight: 300, overflow: 'auto' }}>
                                        <MuiList dense>
                                            {searchResults.map((result, index) => (
                                                <MuiListItemButton key={index} onClick={() => handleSearchResultClick(result.path)}>
                                                    <ListItemText primary={result.text} />
                                                </MuiListItemButton>
                                            ))}
                                        </MuiList>
                                    </Paper>
                                </Popper>
                            </Box>

                            {/* Email Icon */}
                            <IconButton color="inherit">
                                <MailOutlineOutlinedIcon />
                            </IconButton>

                            {/* Notification Icon */}
                            <IconButton color="inherit">
                                <NotificationsNoneOutlinedIcon />
                            </IconButton>                            {/* Avatar */}
                            <Avatar
                                src={`${STANDARD_AVATAR}${userInitials}`}
                                alt={user}
                                sx={{ width: 32, height: 32, bgcolor: 'primary.light', ml: 1 }}
                            />

                            {/* Username */}
                            <Typography variant="subtitle1" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {user ? user : "Usuário"}
                            </Typography>
                        </Box>
                    </ClickAwayListener>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
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
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: EXPANDED_DRAWER_WIDTH
                        }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            overflowX: 'hidden'
                        }
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
                    marginTop: { xs: "56px", sm: "64px" },
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
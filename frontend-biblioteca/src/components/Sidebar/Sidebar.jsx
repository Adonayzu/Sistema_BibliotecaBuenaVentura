import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { axiosInstance } from "../../services/axios.config";
import UserInfo from "../UserInfo/UserInfo";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookIcon from '@mui/icons-material/Book';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SyncIcon from '@mui/icons-material/Sync';
import AssessmentIcon from '@mui/icons-material/Assessment';
import bibliotecaLogo from '../../assets/biblioteca.png';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from "@mui/icons-material/Home";
const drawerWidth = 295; // Ancho del Drawer

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

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [modulos, setModulos] = useState([]);
  const [error, setError] = useState(null);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Obtener módulos y menús según el usuario autenticado
  const fetchModulos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.get("/modulos/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModulos(response.data.modulos || response.data); // Ajusta según la respuesta real del backend
    } catch (err) {
      console.error("Error al obtener los módulos:", err);
      setError("No se pudieron cargar los módulos. Intente nuevamente.");
    }
  };

  useEffect(() => {
    fetchModulos();
  }, []);

  const navigate = useNavigate();

  // Mapeo de nombres de módulos a íconos (Material UI o imágenes)
  const moduleIconMap = {
    "CONFIGURACIÓN": <SettingsIcon sx={{ fontSize: 30 }} />,
    "CONTROL DE BIBLIOTECA": <MenuBookIcon sx={{ fontSize: 30 }} />,


  };

  // Mapeo de nombres de menús a íconos (Material UI o imágenes)
  const menuIconMap = {
    "Gestión De Usuarios": <PeopleAltIcon sx={{ fontSize: 30 }} />,
    "Gestión De Roles": <AssignmentIcon sx={{ fontSize: 30 }} />,
    "Gestión De Libros": <BookIcon sx={{ fontSize: 30 }} />,
    "Gestión De Clientes": <GroupAddIcon sx={{ fontSize: 30 }} />,
    "Gestión De Prestamos": <SyncIcon sx={{ fontSize: 30 }} />,
    "Reportes": <AssessmentIcon sx={{ fontSize: 30 }} />,


  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          background:
            "linear-gradient(90deg,rgb(170, 247, 247) 0%,rgb(74, 92, 226) 100%)",
        }}
      >
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
            <MenuIcon sx={{ color: "black" }} />
          </IconButton>
          <Box
            component="img"
            src={bibliotecaLogo}
            alt="Logo Biblioteca"
            sx={{
              height: 80,
            }}
          />

          <Typography
            textAlign={"center"}
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            color="black"
            fontWeight={"bold"}
          >
            Sistema de Biblioteca - BuenaVentura
          </Typography>
          <IconButton
            variant="contained"
            onClick={() => {
              navigate("/inicio");
            }}
          >
            <HomeIcon sx={{ fontSize: 40, color: "black" }} />
          </IconButton>

            <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            onClick={() => {
                sessionStorage.removeItem("token"); // Elimina el token de sesión
                navigate("/salir"); // Navega a la ruta de salir
            }}
            >
            <ExitToAppIcon sx={{ fontSize: 40, color: "#d50000" }} />
            </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            background:
              "linear-gradient(90deg,rgb(170, 247, 247) 0%,rgb(74, 92, 226) 100%)",
            boxShadow: 5,
          },
        }}
      >
        <DrawerHeader
          sx={{
            background:
              "linear-gradient(90deg,rgb(170, 247, 247) 0%,rgb(74, 92, 226) 100%)",
          }}
        >
          <UserInfo />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ color: "black" }} />
            ) : (
              <ChevronLeftIcon sx={{ color: "black" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {error && (
            <Typography color="error" variant="body2" sx={{ p: 2 }}>
              {error}
            </Typography>
          )}
          {modulos.map((modulo) => (
            <React.Fragment key={modulo.id_modulo}>
              {/* Módulo en negrita */}
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {moduleIconMap[modulo.nombre_modulo] || <AccountCircle sx={{ fontSize: 30 }} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={modulo.nombre_modulo}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {/* Menús con indentación */}
              {modulo.menus.map((menu) => (
                <ListItem
                  key={menu.id_menu || menu.id_menu_navegacion}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    component={NavLink}
                    to={menu.url_menu}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 4,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {menuIconMap[menu.nombre_menu || menu.nombre_menu_navegacion] || <AccountCircle sx={{ fontSize: 30 }} />}
                    </ListItemIcon>
                    <ListItemText
                      primary={menu.nombre_menu || menu.nombre_menu_navegacion}
                      sx={{
                        opacity: open ? 1 : 0,
                        fontWeight: "normal",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

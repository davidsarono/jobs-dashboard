import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import Login from "./pages/Login"
import Jobs from "./pages/Jobs";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Job from "./pages/Job";



const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function RequireAuth() {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="absolute" open={false}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Jobs
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          mt: 10,
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          paddingX: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route exact path="/" element={<Navigate replace to="/jobs" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/jobs"
          element={<RequireAuth />}
        >
          <Route index element={<Jobs />} />
          <Route path=":id" element={<Job />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

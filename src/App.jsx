import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
  Outlet
} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

import LogoutIcon from '@mui/icons-material/Logout';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import Login from './pages/Login';
import Jobs from './pages/Jobs';
import { AuthProvider, Constants, useAuth } from './context/AuthContext';
import { CommonProvider, useCommon } from './context/CommonContext';
import Job from './pages/Job';

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
  const { auth, logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem(Constants.TOKEN);

  const handleLogOut = () => {
    logOut(() => {
      navigate('/login', { replace: true });
    })
  }

  if (auth?.token || token) {
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

            <IconButton color="inherit" onClick={handleLogOut}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            mt: 10,
            flexGrow: 1,
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
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}

function AlertMessage() {
  const { common, setCommon } = useCommon();

  return (
    <Collapse
      in={common.isOpen}
      sx={{
        position: 'sticky',
        width: '35%',
        top: 5,
        left: '50%',
        transform: 'translate(-50%)',
        zIndex: 9999
      }}
    >
      <Alert
        variant="filled"
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setCommon(prevState => ({ ...prevState, isOpen: false, errorMessages: '' }))
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {common.errorMessages}
      </Alert>
    </Collapse>
  )
}

export function App() {

  return (
    <>
      <CommonProvider>
        <AlertMessage />

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
      </CommonProvider>
    </>
  );
}

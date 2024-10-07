import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const Logout = () => {
  const { isAuthenticated, logout } = useAuth0();

  const handleLogout = () => {
    logout();
  };

  return isAuthenticated ? (
    <Button
      variant="contained"
      onClick={handleLogout}
      color="inherit"
      sx={{ color: '#000000' }}
    >
      ログアウト
      <LogoutIcon sx={{ marginLeft: 1 }} />
    </Button>
  ) : null;
};

export default Logout;

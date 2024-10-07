import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Login: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await loginWithRedirect();
  };

  return !isAuthenticated ? (
    <>
      <Button
        variant="contained"
        onClick={handleLogin}
        color="inherit"
        sx={{ color: '#000000' }}
      >
        ログイン
        <AccountCircleIcon sx={{ marginLeft: 1 }} />
      </Button>
    </>
  ) : null;
};

export default Login;

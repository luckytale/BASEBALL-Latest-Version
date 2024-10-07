import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import Title from '../assets/images/Title.jpeg';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './Login';
import Logout from './Logout';

const Rooters: Array<{ text: string; url: string }> = [
  { text: 'チーム', url: '/teams' },
  { text: '試合', url: '/games' },
  { text: '投手成績', url: '/pitcher' },
  { text: '野手成績', url: '/batter' },
];

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth0();
  console.log('isAuthenticated:', isAuthenticated);

  return (
    <>
      <AppBar
        sx={{ backgroundColor: '#000000' }}
        component="header"
        position="static"
      >
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ marginLeft: 5, marginRight: 10 }}>
            <Typography>
              <Link to="/">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60px',
                  }}
                >
                  <img src={Title} alt="BASEBALL" height="40px" width="auto" />
                </div>
              </Link>
            </Typography>
          </Box>
          <Box>
            <List
              component="nav"
              sx={{ display: 'flex', justifyContent: 'flex-start' }}
            >
              {Rooters.map((Rooter) => (
                <ListItem
                  key={Rooter.url}
                  disablePadding
                  sx={{ marginRight: 2 }}
                >
                  <ListItemButton
                    component={Link}
                    to={Rooter.url}
                    sx={{
                      textAlign: 'center',
                      backgroundColor:
                        location.pathname === Rooter.url
                          ? '#f5f5f5'
                          : 'transparent',
                      color:
                        location.pathname === Rooter.url
                          ? '#000000'
                          : '#f5f5f5',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        color: '#000000',
                      },
                    }}
                  >
                    <ListItemText
                      primary={Rooter.text}
                      sx={{ whiteSpace: 'nowrap' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box
            sx={{
              marginLeft: 'auto',
              marginRight: 5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <Login />
                <Logout />
              </div>
            )}
          </Box>
        </Box>
      </AppBar>
    </>
  );
};

export default Header;

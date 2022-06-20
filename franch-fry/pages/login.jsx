//@ts-check
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

import Link from 'next/link';

import { useDispatch, useSelector } from "react-redux";

import { login } from '../redux/actions/login-actions';
import store from '../redux/store';
const dispatch = store.dispatch;
//@ts-ignore
import Style from '../styles/Login.module.css';
import { Paper, Typography } from '@mui/material';

function Login(){
  return (
    <div className={Style.content}>
      <Paper sx={{p:5, height: 500}} elevation={2}>
        <Typography variant='h5'>Login</Typography>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <Link 
            href='/dashboard'
            >
            <a onClick={()=>{ dispatch(login('Gerald', 'Fitzgerald', 'Administrator', '123abc')) }}>
              <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                <ListItemText primary="Gerald Fitzgerald" secondary="Administrator" />
              </ListItem>
            </a>
          </Link>
          <Link 
            href='/dashboard'
            >
            <a onClick={()=>{ dispatch(login('Hisham', 'Mohammed', 'Franchise Owner', '456def')) }}>
              <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                <ListItemText primary="Hisham Mohammed" secondary="Franchise Owner" />
              </ListItem>
            </a>
          </Link>
        </List>
      </Paper>
    </div>
  );
}

export default Login;
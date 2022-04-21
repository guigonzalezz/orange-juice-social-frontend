import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, IconButton, ListItemIcon, ListItemText, MenuItem, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useContext, useState } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from './shared/SearchBoxMenu';
import { AuthContext } from '../contexts/AuthContext';
import { AccountCircle, Logout, Notifications, Person, School } from '@mui/icons-material';
import { StyledMenuAnchor } from './shared/StyledAnchorMenu';
import { useRouter } from 'next/router';

const DashboardNavbarRoot = styled(AppBar)(({ theme }: any) => ({
  backgroundColor: "#161616",//theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, avatarLink, usuarioLogadoEmail, ...other  } = props;
  const { logout } = useContext(AuthContext)
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = async  () => {
    await logout();
  }

  const handlePefil = () => {
    router.push(`/perfil/${usuarioLogadoEmail}`)
  }

  const handleTutorial = () => {
    router.push(`/tutorial`)
  }

  const handleHome = () => {
    router.push(`/home`)
  }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 200
          },
          width: {
            lg: 'calc(100% - 200px)'
          },
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            background: '#161616',
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Home">
            <IconButton sx={{ ml: 1 }} onClick={handleHome}>
              <img
                width={60}
                height={60}
                src='/logo_static.svg'
                alt="logo orange juice"
                aria-label='logo orange juice'
              />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />

          {/* <Tooltip title="Search">
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: '#5F6060'}}/>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Tooltip> */}

          <Box sx={{ flexGrow: 1 }} />

          <Avatar
            onClick={handleAvatarClick}
            sx={{
              height: 40,
              width: 40,
              ml: 1,
              borderColor: '#F96400',
              borderStyle: 'solid',
              borderWidth: 2,
              cursor: 'pointer'
            }}
            src={avatarLink}
          >
            <AccountCircle fontSize="small" />
          </Avatar>
        </Toolbar>
        <StyledMenuAnchor
          sx={{

          }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleAvatarClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handlePefil}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>Perfil</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleTutorial}>
            <ListItemIcon>
              <School fontSize="small" />
            </ListItemIcon>
            <ListItemText>Tutorial</ListItemText>
          </MenuItem>
          <MenuItem onClick={logoutUser}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sair</ListItemText>
          </MenuItem>
        </StyledMenuAnchor>
      </DashboardNavbarRoot>
    </>
  );
};

import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Bell as BellIcon } from '../icons/bell';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { Users as UsersIcon } from '../icons/users';
import { UsuarioContext } from '../contexts/UsuarioContext';
import { useContext, useEffect, useState } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from './shared/SearchBoxMenu';
import { AuthContext } from '../contexts/AuthContext';
import { ContentCopy, Logout } from '@mui/icons-material';
import { StyledMenuAnchor } from './shared/StyledAnchorMenu';

const DashboardNavbarRoot = styled(AppBar)(({ theme }: any) => ({
  backgroundColor: "#161616",//theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, avatarLink, ...other } = props;
  const { logout } = useContext(AuthContext)

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
            <IconButton sx={{ ml: 1 }}>
              <img width={60} height={60} src='/logo_static.svg' alt="logo orange juice" aria-label='logo orange juice'/>
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Search">
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: '#5F6060'}}/>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
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
            <UserCircleIcon fontSize="small" />
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

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  avatarLink: PropTypes.string
};

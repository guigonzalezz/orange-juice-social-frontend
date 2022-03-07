import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import { Users as UsersIcon } from '../icons/users';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'
import { NavItem } from './nav-item';
import { AssignmentInd, Feed, Quiz, School, Task } from '@mui/icons-material';

const items = [
  {
    isAdmin: false,
    component: (<NavItem
      key='Home'
      icon={<HomeIcon fontSize="small" />}
      href='/home'
      title='Home'
    />)
  },
  {
    isAdmin: true,
    component: (<NavItem
      key='Home'
      icon={<HomeIcon fontSize="small" />}
      href='/home'
      title='Home'
    />)
  },
  {
    isAdmin: true,
    component: (<NavItem
      key='Usuarios'
      icon={<UsersIcon fontSize="small" />}
      href='/usuarios'
      title='Usuarios'
    />)
  },
  {
    isAdmin: true,
    component: (<NavItem
      key='Cargos'
      icon={<AssignmentInd fontSize="small" />}
      href='/cargos'
      title='Cargos'
    />)
  },
  {
    isAdmin: true,
    component: (<NavItem
      key='Desafios'
      icon={<Task fontSize="small" />}
      href='/desafios'
      title='Desafios'
    />)
  },
  {
    isAdmin: false,
    component: (<NavItem
      key='Desafios'
      icon={<Task fontSize="small" />}
      href='/desafios'
      title='Desafios'
    />)
  },
  {
    isAdmin: false,
    component: (<NavItem
      key='Trilhas'
      icon={<School fontSize="small" />}
      href='/trilhas'
      title='Trilhas'
    />)
  },
  {
    isAdmin: false,
    component: (<NavItem
      key='Quiz'
      icon={<Quiz fontSize="small" />}
      href='/quiz'
      title='Quiz'
    />)
  },
  {
    isAdmin: true,
    component: (<NavItem
      key='Quiz'
      icon={<Quiz fontSize="small" />}
      href='/quiz'
      title='Quiz'
    />)
  },
  {
    isAdmin: true,
    component: (<NavItem
      key='Relatorios'
      icon={<Feed fontSize="small" />}
      href='/relatorios'
      title='Relatorios'
    />)
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose, isAdmin } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MenuIcon fontSize="small" />
        <Typography>Menu</Typography>
      </Box>
      <Divider sx={{ borderColor: '#8a8b8c4f', mb: 3 }} />
      <Box sx={{ flexGrow: 1 }}>
        {items.filter((item) => item.isAdmin == isAdmin).map(item=>item.component)}
      </Box>

      <Divider sx={{ borderColor: '#8a8b8c4f' }} />
      <Box sx={{px: 2, py: 3 }}>
        <Typography color="neutral.500" variant="body2">
          © 2022 FCamara Formação e Consultoria. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: '#161616',
            color: '#FFFFFF',
            width: 200,
            borderColor: '#8a8b8c4f',
            borderRightWidth: 1
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: '#161616',
          color: '#FFFFFF',
          width: 200,

        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { format } from 'date-fns';
import {
  Box,
  Card,
  Checkbox,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { LegendToggle, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { StyledMenuAnchor } from '../shared/StyledAnchorMenu'
import { withStyles } from '@mui/styles';


export const UsuarioListResults = ({ variaveis, funcoes, ...rest }) => {
  const { usuarios,usuariosTable, filtroNome, idsUsuariosSelecionados } = variaveis
  const { setUsuariosTable, setIdsUsuariosSelecionados} = funcoes
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [actualValue, setActualValue] = useState(0)

  useEffect(()=>{
    if(filtroNome == '') setUsuariosTable(usuarios)
    else setUsuariosTable(usuariosTable.filter(usuario => usuario.perfil.nome.includes(filtroNome)))
  },[filtroNome])

  const handleSelectAll = (event) => {
    let newSelectedUsuarioIds;

    if (event.target.checked) {
      newSelectedUsuarioIds = usuariosTable.map((usuario) => usuario.id_usuario);
    } else {
      newSelectedUsuarioIds = [];
    }

    setIdsUsuariosSelecionados(newSelectedUsuarioIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = idsUsuariosSelecionados.indexOf(id);
    let newSelectedUsuarioIds = [];

    if (selectedIndex === -1) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(idsUsuariosSelecionados, id);
    } else if (selectedIndex === 0) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(idsUsuariosSelecionados.slice(1));
    } else if (selectedIndex === idsUsuariosSelecionados.length - 1) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(idsUsuariosSelecionados.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsuarioIds = newSelectedUsuarioIds.concat(
        idsUsuariosSelecionados.slice(0, selectedIndex),
        idsUsuariosSelecionados.slice(selectedIndex + 1)
      );
    }

    setIdsUsuariosSelecionados(newSelectedUsuarioIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActualValue = (id) => {
    setActualValue(id)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUsuario = async (id:any) => {
    await axios.patch(`http://localhost:8080/usuario/toggleAtivoInativo?id_usuario=${id}`)
      .then(async res=> {
        if(res.data) {
          console.log("ATUALIZOU")
          await axios.get(`http://localhost:8080/usuario/listar`)
            .then(res => {
              setUsuariosTable(res.data)
            })
        }else {
          console.log("NAO ATUALIZOU")
        }
      })
  }

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow sx={{background:'#232323'}}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={idsUsuariosSelecionados.length === usuariosTable.length}
                    color="primary"
                    indeterminate={
                      idsUsuariosSelecionados.length > 0
                      && idsUsuariosSelecionados.length < usuariosTable.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{color:'white', fontSize: 12}}>Nome</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{color:'white', fontSize: 12}}>Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{color:'white', fontSize: 12}}>Localização</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{color:'white', fontSize: 12}}>Contato</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{color:'white', fontSize: 12}}>Cargo</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{color:'white', fontSize: 12}}>Ações</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(limit > 0
                ? usuariosTable.slice(page * limit, page * limit + limit)
                : usuariosTable).map((usuario, key) =>  (
                  <TableRow
                    key={key}
                    selected={idsUsuariosSelecionados.indexOf(usuario.id_usuario) !== -1}
                    sx={{
                      background: '#1c1c1c',
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={idsUsuariosSelecionados.indexOf(usuario.id_usuario) !== -1}
                        onChange={(event) => handleSelectOne(event, usuario.id_usuario)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{alignItems: 'center',display: 'flex'}}>
                        <Box>
                          <Typography sx={{ fontSize: 14}} variant="body1">{usuario.perfil.nome}</Typography>
                          <Typography sx={{ fontSize: 14}} color='#8C8C8C' variant="body1">{usuario.perfil.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {usuario.ativo_SN == 'S' ?
                          <Chip size="small" label="Ativo" color="primary" />
                          :
                          // @ts-ignore:
                          <Chip size="small" label="Inativo" color="inative"/>
                        }
                        <Typography color='#8C8C8C' sx={{fontSize: 12}}>Criado em:{format(new Date(usuario.stamp_created), 'dd/MM/yyyy')}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography >{`${usuario.perfil.cidade}, ${usuario.perfil.estado}, ${usuario.perfil.pais}`}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography >{usuario.perfil.contato}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography >{usuario.cargo.nome}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(e)=>{
                          handleActualValue(usuario.id_usuario)
                          handleClick(e)
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                      <StyledMenuAnchor
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <MenuItem onClick={()=>{handleStatusUsuario(actualValue)}}>
                          <ListItemIcon>
                            <LegendToggle fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Toggle Status</ListItemText>
                        </MenuItem>
                      </StyledMenuAnchor>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={usuariosTable.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          background:'#F96400',
        }}
      />
    </Card>
  );
};



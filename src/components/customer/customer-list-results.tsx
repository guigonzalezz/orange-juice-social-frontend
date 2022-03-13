import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

export const CustomerListResults = ({ variaveis, funcoes, ...rest }) => {
  const { usuarios,usuariosTable, filtroNome, idsUsuariosSelecionados } = variaveis
  const { setUsuariosTable, setIdsUsuariosSelecionados} = funcoes
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(()=>{
    if(filtroNome == '') setUsuariosTable(usuarios)
    else setUsuariosTable(usuariosTable.filter(usuario => usuario.perfil.nome.includes(filtroNome)))
  },[filtroNome])

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = usuariosTable.map((usuario) => usuario.id_usuario);
    } else {
      newSelectedCustomerIds = [];
    }

    setIdsUsuariosSelecionados(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = idsUsuariosSelecionados.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(idsUsuariosSelecionados, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(idsUsuariosSelecionados.slice(1));
    } else if (selectedIndex === idsUsuariosSelecionados.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(idsUsuariosSelecionados.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        idsUsuariosSelecionados.slice(0, selectedIndex),
        idsUsuariosSelecionados.slice(selectedIndex + 1)
      );
    }

    setIdsUsuariosSelecionados(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
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
                  Nome
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Localização
                </TableCell>
                <TableCell>
                  Contato
                </TableCell>
                <TableCell>
                  Data de registro
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosTable.slice(0, limit).map((usuario) => (
                <TableRow
                  hover
                  key={usuario.id_usuario}
                  selected={idsUsuariosSelecionados.indexOf(usuario.id_usuario) !== -1}
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
                      <Avatar src={usuario.avatar_url} sx={{ mr: 2 }}></Avatar>
                      <Typography color="textSecondary" variant="body1">{usuario.perfil.nome}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">{usuario.perfil.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">{`${usuario.perfil.cidade}, ${usuario.perfil.estado}, ${usuario.perfil.pais}`}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">{usuario.perfil.contato}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">{format(new Date(usuario.stamp_created), 'dd/MM/yyyy')}</Typography>
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



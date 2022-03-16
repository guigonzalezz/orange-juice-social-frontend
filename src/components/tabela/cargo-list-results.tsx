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


export const CargoListResults = ({ variaveis, funcoes, ...rest }) => {
  const { cargos,cargosTable, filtroNome, idsCargosSelecionados } = variaveis
  const { setCargosTable, setIdsCargosSelecionados} = funcoes
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [actualValue, setActualValue] = useState(0)

  useEffect(()=>{
    if(filtroNome == '') setCargosTable(cargos)
    else setCargosTable(cargosTable.filter(cargo => cargo.nome.includes(filtroNome)))
  },[filtroNome])

  const handleSelectAll = (event) => {
    let newSelectedCargoIds;

    if (event.target.checked) {
      newSelectedCargoIds = cargosTable.map((cargo) => cargo.id_cargo);
    } else {
      newSelectedCargoIds = [];
    }

    setIdsCargosSelecionados(newSelectedCargoIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = idsCargosSelecionados.indexOf(id);
    let newSelectedCargoIds = [];

    if (selectedIndex === -1) {
      newSelectedCargoIds = newSelectedCargoIds.concat(idsCargosSelecionados, id);
    } else if (selectedIndex === 0) {
      newSelectedCargoIds = newSelectedCargoIds.concat(idsCargosSelecionados.slice(1));
    } else if (selectedIndex === idsCargosSelecionados.length - 1) {
      newSelectedCargoIds = newSelectedCargoIds.concat(idsCargosSelecionados.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCargoIds = newSelectedCargoIds.concat(
        idsCargosSelecionados.slice(0, selectedIndex),
        idsCargosSelecionados.slice(selectedIndex + 1)
      );
    }

    setIdsCargosSelecionados(newSelectedCargoIds);
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

  const handleStatusCargo = async (id:any) => {
    await axios.patch(`http://localhost:8080/cargo/toggleAtivoInativo?id_cargo=${id}`)
      .then(async res=> {
        if(res.data) {
          await axios.get(`http://localhost:8080/cargo/listarTodos`)
            .then(res => {
              setCargosTable(res.data)
            })
        }
      })
  }

  return (
    <Card {...rest} sx={{ width: '100%', overflow: 'hidden'}}>
      <Box >
        <Table >
          <TableHead>
            <TableRow sx={{background:'#232323'}}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={idsCargosSelecionados.length === cargosTable.length}
                  color="primary"
                  indeterminate={
                    idsCargosSelecionados.length > 0
                    && idsCargosSelecionados.length < cargosTable.length
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
                <Typography sx={{color:'white', fontSize: 12}}>Ações</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              overflow: 'hidden',
              overflowX: 'hidden',
              overflowY: 'scroll',
              '&::-webkit-scrollbar': {
                height: '0.4em',
                width: 8
              },
              '&::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(16,16,16,.9)',
                borderRadius: 25,
              },
            }}
          >
            {(limit > 0
              ? cargosTable.slice(page * limit, page * limit + limit)
              : cargosTable).map((cargo, key) =>  (
                <TableRow
                  key={key}
                  selected={idsCargosSelecionados.indexOf(cargo.id_cargo) !== -1}
                  sx={{
                    background: '#1c1c1c',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={idsCargosSelecionados.indexOf(cargo.id_cargo) !== -1}
                      onChange={(event) => handleSelectOne(event, cargo.id_cargo)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{alignItems: 'center',display: 'flex'}}>
                      <Box>
                        <Typography sx={{ fontSize: 14}} variant="body1">{cargo.nome}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {cargo.ativo_SN == 'S' ?
                        <Chip size="small" label="Ativo" color="primary" />
                        :
                        // @ts-ignore:
                        <Chip size="small" label="Inativo" color="inative"/>
                      }
                    </Box>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(e)=>{
                        handleActualValue(cargo.id_cargo)
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
                      <MenuItem onClick={()=>{handleStatusCargo(actualValue)}}>
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
      <TablePagination
        component="div"
        count={cargosTable.length}
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



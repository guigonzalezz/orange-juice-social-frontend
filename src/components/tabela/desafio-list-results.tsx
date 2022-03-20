import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Card,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Send, MoreVert } from '@mui/icons-material';
import { StyledMenuAnchor } from '../shared/StyledAnchorMenu'

export const DesafioListResults = ({ variaveis, funcoes, ...rest }) => {
  const { desafios,desafiosTable, filtroNome } = variaveis
  const { setDesafiosTable, handleEnviaFeedbackOpen, setHandleAlteraDesafioInfo } = funcoes
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);


  useEffect(()=>{
    if(filtroNome == '') setDesafiosTable(desafios)
    else setDesafiosTable(desafios.filter(desafio => desafio.desafio_nome.includes(filtroNome)))
  },[filtroNome])


  const handleLimitChange = (event) => { setLimit(event.target.value) }
  const handlePageChange = (event, newPage) => { setPage(newPage) }
  const handleClick= (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget) }
  const handleClose= () => { setAnchorEl(null) }

  return (
    <Card {...rest} sx={{ width: '100%', overflow: 'hidden'}}>
      <Box >
        <Table >
          <TableHead>
            <TableRow sx={{background:'#232323'}}>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Nome</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Status</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Desafio</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{color:'white', fontSize: 12}}>Categoria</Typography>
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
              }
            }}
          >
            {(limit > 0
              ? desafiosTable.slice(page * limit, page * limit + limit)
              : desafiosTable).map((desafio, key) =>  (
                <TableRow
                  key={key}
                  sx={{
                    background: '#1c1c1c',
                  }}
                >
                  <TableCell>
                    <Box sx={{alignItems: 'center',display: 'flex'}}>
                      <Box>
                        <Typography sx={{ fontSize: 14}} variant="body1">{desafio.usuario.nome}</Typography>
                        <Typography sx={{ fontSize: 14}} color='#8C8C8C' variant="body1">{desafio.usuario.email_empresarial}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {desafio.feedback_recebido_SN == 'S' ?
                        <Chip size="small" label="OK" color="primary" />
                        :
                        // @ts-ignore:
                        <Chip size="small" label="Aguardando" color="inative"/>
                      }
                      <Typography color='#8C8C8C' sx={{fontSize: 12}}>Enviado em: {format(new Date(desafio.stamp_enviado), 'dd/MM/yyyy')}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography >{desafio.desafio_nome}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography >{desafio.categoria}</Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(e)=>{
                        setHandleAlteraDesafioInfo(desafio)
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
                      <MenuItem onClick={()=>{handleEnviaFeedbackOpen()}}>
                        <ListItemIcon>
                          <Send fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Enviar feedback</ListItemText>
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
        count={desafiosTable.length}
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



import React, {useEffect, useState} from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import Link from 'next/link'
import { PermPhoneMsgOutlined, PhoneDisabledOutlined } from '@mui/icons-material';
import { format, addHours } from 'date-fns';


interface IProps {
  item: IEventos
}
interface IEventos {
  titulo: string,
  descricao: string,
  data: string,
  link: string
}


export const Eventos = (props) => {
  const { info } = props
  const [items, setItems] = useState(info)

  useEffect(()=>{
    setItems(items.sort((a, b) =>  new Date(a.data) > new Date(b.data) ? 1 :  new Date(b.data) > new Date(a.data) ? -1 : 0))
    setItems(items.filter(elem => new Date(elem.data).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)))
  },[])

  function Item({ item }:IProps)
  {
    const status = new Date(item.data) > addHours(new Date(), 1) ? '#D14343' : new Date(item.data) < new Date() ? '#FF8A3C' : '#14B8A6'

    return (
      <Tooltip title={item.descricao}>
        <Box
          component="div"
          sx={{
            minHeight: 120,
            minWidth: 330,
            mx: 2,
            mb: 2,
            borderRadius: 2,
            display: 'flex',
            background: '#17151C'
          }}
        >
          <Box
            component="div"
            sx={{
              height: '100%',
              width: 8,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              background: status
            }}
          >

          </Box>

          <Box
            component="div"
            sx={{
              width: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              p:2
            }}
          >
            <Typography>{item.titulo}</Typography>
            <Typography sx={{color:'#9590A0'}}>{
              format(new Date(item.data), 'p')
            }</Typography>
          </Box>

          <Box
            component="div"
            sx={{
              width: '20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {
              status != '#D14343' ?
              <Link
                href={item.link}
                passHref>
                <a
                  style={{textDecoration: 'none', color:'#fff'}}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Box sx={{
                    background: status,
                    minWidth: 48,
                    minHeight: 48,
                    borderRadius: 25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <PermPhoneMsgOutlined  />
                  </Box>
                </a>
              </Link>
              :
              <Box sx={{
                background: status,
                minWidth: 48,
                minHeight: 48,
                borderRadius: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed'
              }}>
                <PhoneDisabledOutlined />
              </Box>
            }
          </Box>
        </Box>
      </Tooltip>
    )
  }

  return (
    items.length > 0 ?
    <Box
      component="div"
      sx={{
        backgroundColor: 'transparent',
        width: '100%',
        height: 380,
        overflowX: 'hidden',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 2,
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
      {
        items.map( (item:IEventos, i) =>
          <Item
            key={i}
            item={item}
          />
        )
      }
     </Box>
    :
      <Box sx={{
        width: '100%',
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography sx={{ color: '#454B50', fontSize: 24}}>Nenhum evento encontrado...</Typography>
      </Box>
  );
};


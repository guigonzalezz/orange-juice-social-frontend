import React, {useState} from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import Link from 'next/link'

interface IProps {
  item: IBlog
}
interface IBlog {
  descricao: string,
  imagem: string,
  autor: string,
  link: string,
  stampCreated: string,
  titulo: string,
}


export const Blog = (props) => {
  const { info } = props
  const [items, setItems] = useState(info)

  function Item({ item }:IProps)
  {
      return (
        <Link href={item.link} passHref>
          <a style={{textDecoration: 'none', color:'#fff'}} target="_blank" rel="noopener noreferrer">
            <Box component="div" sx={{
              height: 352,
              width: 330,
              minWidth: 230,
              mx: 2,
              p: 2,
              cursor:'pointer',
            }}
            >
              <Tooltip title={item.descricao}>
                <img style={{borderRadius: 10}} width={'100%'} height={'50%'} src={item.imagem}/>
              </Tooltip>

              <Box component="div" sx={{width: '100%', display: 'flex', height: '10%'}}>
                <Typography sx={{color:"#F5556E", fontSize: 14, mr:2}}>{item.autor}</Typography>
              </Box>

              <Typography sx={{ height: "40%", fontSize: 18}} >{item.titulo}</Typography>
            </Box>
          </a>
        </Link>
      )
  }

  return (
    items.length > 0 ?
    <Box component="div"
     sx={{
      backgroundColor: 'transparent',
      width: '100%',
      height: 355,
      overflowX: 'scroll',
      overflowY: 'hidden',
      display: 'flex',
      justifyContent: 'flex-start',
      padding: 2,
      '&::-webkit-scrollbar': {
        width: '0.4em',
        height: 8
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
        items.map( (item:IBlog, i) => <Item key={i} item={item}/> )
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
        <Typography sx={{ color: '#454B50', fontSize: 24}}>Nenhuma post disponivel no momento...</Typography>
      </Box>
  );
};


import React, {useEffect, useState} from 'react'
import { Box, Typography } from '@mui/material'



interface IProps {
  item: IEventos
}
interface IEventos {
  titulo: string,
  descricao: string,
  data: string,
  link: string
}


export const Calendario = (props) => {

  const { info } = props
  const [items, setItems] = useState(info)

  useEffect(()=>{

  },[])

  return (
    <Box sx={{
      width: '100%',
      height: 380,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#232323'
   }}>
     <Typography sx={{ color: '#454B50', fontSize: 24}}>Em breve...</Typography>
   </Box>
  );
};


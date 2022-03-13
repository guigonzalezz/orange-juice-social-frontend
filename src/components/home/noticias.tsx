import React, {useEffect, useState} from 'react'
import { Box, Button, Typography, Tooltip } from '@mui/material';

import { addDays, format } from 'date-fns';
import Link from 'next/link';

interface IProps {
  item: INoticia
}
interface INoticia {
  descricao: string,
  imagem: string,
  link: string,
  stampAt: string,
  stampCreated: string,
  titulo: string,
}


export const Noticias = (props) => {
  const { info } = props
  const [items, setItems] = useState(info)

  useEffect(()=>{//Noticia esta na data de validade?
    if(items.length > 0){
      setItems(items.filter(item => format(addDays(new Date(item.stampAt),1), 'dd/MM/yyyy') > format(new Date(), 'dd/MM/yyyy')))
      setItems(items.sort((a, b) =>  a.stampCreated > b.stampCreated ? 1 :  b.stampCreated > a.stampCreated ? -1 : 0))
    }
  },[])

  function Item({ item }:IProps)
  {
      return (
          <Tooltip title={item.descricao}>
            <Box component="div" sx={{
              height: 340,
              width: 230,
              minWidth: 230,
              mx: 2,
              p: 2,
              borderStyle: 'solid',
              borderImageSlice: 1,
              borderWidth: 3,
              borderImageSource: 'linear-gradient(to top, #F96400, #FECE00)',
              //https://css-tricks.com/gradient-borders-in-css/
            }}>
                <img style={{borderRadius: 10}} width={'100%'} height={'50%'} src={item.imagem}/>
                <Typography>{item.titulo}</Typography>

                <Box component="div" sx={{}}>
                  <Box component="div" sx={{width: '100%', display: 'flex',}}>
                    <Typography sx={{color:"#758089", fontSize: 14, mr:2}}>Created at</Typography>
                    <Typography sx={{ fontSize: 14}}>{format(addDays(new Date(item.stampCreated),1), 'dd/MM/yyyy')}</Typography>
                  </Box>
                </Box>

                <Box component="div" sx={{display: 'flex', justifyContent: 'space-between', mt: 3}}>
                  <Button sx={{width: 90, background: '#26282E'}}>
                    <Link href={item.link} passHref>
                      <a style={{textDecoration: 'none', color:'#fff'}} target="_blank" rel="noopener noreferrer">DETALHES</a>
                    </Link>
                  </Button>
                  <Button sx={{width: 90, background: '#37271E'}} onClick={()=> {
                    setItems(items.filter(elem => elem.titulo != item.titulo))
                  }}>
                    OK
                  </Button>
                </Box>
            </Box>
          </Tooltip>
      )
  }

  return (
    items.length > 0 ?
    <Box component="div"
     sx={{
      backgroundColor: 'transparent',
      width: '100%',
      height: 380,
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
       items.map( (item:INoticia, i) => <Item key={i} item={item}/> )
      }
     </Box>
     :
     <Box sx={{
        width: '100%',
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
     }}>
       <Typography sx={{ color: '#454B50', fontSize: 24}}>Nenhuma noticia disponivel no momento...</Typography>
     </Box>
  );
};


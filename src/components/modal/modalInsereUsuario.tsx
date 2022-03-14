import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FormInsereUsuario from '../form/formInsereUsuario';

const ModalInsereUsuario = ({ open, handleClose, cargos }) => {
  return (
    <Dialog open={open} onClose={handleClose} disableEnforceFocus>
      <FormInsereUsuario handleClose={handleClose} cargos={cargos} />
    </Dialog>
  );
};

export default ModalInsereUsuario;

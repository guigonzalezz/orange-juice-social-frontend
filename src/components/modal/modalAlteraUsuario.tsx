import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FormAlteraUsuario from '../form/formAlteraUsuario';

const ModalAlteraUsuario = ({ open, handleClose, cargos, usuario}) => {
  return (
    <Dialog open={open} onClose={handleClose} disableEnforceFocus>
      <FormAlteraUsuario handleClose={handleClose} cargos={cargos} usuario={usuario} />
    </Dialog>
  );
};

export default ModalAlteraUsuario;

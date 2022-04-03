import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import FormAlteraUsuario from '../form/formAlteraUsuario';
import FormAlteraPerfil from '../form/formAlteraPerfil';

const ModalAlteraPerfil = ({ open, handleClose, usuario}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEnforceFocus
    >
      <FormAlteraPerfil
        handleClose={handleClose}
        usuario={usuario}
      />
    </Dialog>
  );
};

export default ModalAlteraPerfil;

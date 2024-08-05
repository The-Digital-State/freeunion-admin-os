import Modal from 'components/molecules/Modal';
import React, { useState } from 'react';
import TaskModal from 'components/molecules/TasksModal';

export const ModalContext = React.createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  function closeModal() {
    setModal(null);
  }

  function openModal(modal, modalProps) {
    setModal({
      component: modal,
      modalProps,
    });
  }
  const ModalComponent = modal?.modalProps?.isTask ? TaskModal : Modal;
  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {modal?.component && (
        <ModalComponent onClose={closeModal} open={true} {...modal.modalProps}>
          {modal.component}
        </ModalComponent>
      )}

      {children}
    </ModalContext.Provider>
  );
}

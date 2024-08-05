import { useDispatch } from '../../../redux';
import { useParams } from 'react-router';
import { getHelpOffers } from 'redux/slices/unionHelpOffers';
import { getRequests } from 'redux/slices/requests';
import { useContext, useEffect } from 'react';
import { ModalContext } from 'context/Modal';
import Feedback, { checkIfShowFeedbackModal } from 'shared/components/modals/Feedback/Feedback';
import { routes } from 'Routes';

const UnionWrapper = ({ children }) => {
  const params = useParams<{ organizationId?: string }>();
  const { organizationId } = params;
  const dispatch = useDispatch();
  const modalContext = useContext(ModalContext);

  useEffect(() => {
    if (checkIfShowFeedbackModal()) {
      modalContext.openModal(
        <Feedback chatLink={routes.chat.getLink(organizationId)} closeModal={modalContext.closeModal} />
      );
    }
  }, []);

  useEffect(() => {
    const intervalRequest = setInterval(() => {
      dispatch(getRequests(organizationId));
    }, 1000 * 60 * 3);

    dispatch(getHelpOffers(organizationId));
    dispatch(getRequests(organizationId));

    return () => {
      clearInterval(intervalRequest);
    };
  }, [organizationId]);

  return children;
};

export default UnionWrapper;

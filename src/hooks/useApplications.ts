import debounce from 'debounce';

import { useCallback, useRef, useState } from 'react';
import {
  getApplications,
  applyApplication as fetchApplyApplication,
  rejectApplication as fetchRejectApplication,
  IApplication,
  IApplyApplication,
  IRejectApplication,
  IGetApplications,
} from '../services/api/applications';

export const useApplication = () => {
  const debouncedList = useRef(null);
  const [grandTotalCount, setGrandTotalCount] = useState<number>(null);
  const [grandNewCount, setGrandNewCount] = useState<number>(null);
  const [list, setList] = useState<{
    loading: boolean;
    totalCount: number;
    data: IApplication[];
  }>({
    loading: false,
    totalCount: 0,
    data: [],
  });

  const [apply, setApply] = useState({
    loading: false,
  });

  const [reject, setReject] = useState({
    loading: false,
  });

  const fetchGrandTotalCount = useCallback((organizationId: number) => {
    setGrandTotalCount(null);

    return getApplications({ organizationId })
      .then(({ applications, totalCount }) => {
        setGrandTotalCount(applications.length);

        setGrandNewCount(applications.filter((a) => !a.status).length);
      })
      .catch((e) => {
        setGrandTotalCount(null);

        throw e;
      });
  }, []);

  const fetchApplications = useCallback(
    (props: IGetApplications) =>
      new Promise((resolve, reject) => {
        setList({ ...list, loading: true });
        
        debouncedList.current?.clear();

        const debounced = debounce(() => {
          debouncedList.current?.clear();
          getApplications(props)
            .then(({ applications, totalCount }) => {
              setList({
                ...list,
                loading: false,
                data: applications,
                totalCount: totalCount,
              });
              resolve({ ata: applications, totalCount: applications.length });
            })
            .catch((e) => {
              setList({ ...list, loading: false });

              reject(e);
            });
        }, 500);

        debouncedList.current = debounced;
        debounced();
      }),
    []
  );

  const applyApplication = useCallback((props: IApplyApplication) => {
    setApply({ ...apply, loading: true });

    return fetchApplyApplication(props)
      .then(() => {
        setApply({ ...apply, loading: false });
      })
      .catch((e) => {
        setApply({ ...apply, loading: false });

        throw e;
      });
  }, []);

  const rejetApplication = useCallback((props: IRejectApplication) => {
    setReject({ ...reject, loading: true });

    return fetchRejectApplication(props)
      .then(() => {
        setReject({ ...reject, loading: false });
      })
      .catch((e) => {
        setReject({ ...reject, loading: false });

        throw e;
      });
  }, []);

  return {
    grandTotalCount: {
      valueAll: grandTotalCount,
      valueNew: grandNewCount,
      fetch: fetchGrandTotalCount,
    },
    list: {
      ...list,
      fetch: fetchApplications,
    },
    apply: {
      ...apply,
      fetch: applyApplication,
    },
    reject: {
      ...reject,
      fetch: rejetApplication,
    },
  };
};

export default useApplication;

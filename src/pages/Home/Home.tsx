import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import NavigationLayout from 'components/layout/NavigationLayout';
import { listAdminOrganizations } from 'services/api/organizations';
import config from 'config';
import { Button } from '@material-ui/core';

function Home() {
  const history = useHistory();

  const [organizations, setOrganizations] = useState(null);
  useEffect(() => {
    (async () => {
      const organizations = await listAdminOrganizations();

      if (organizations.length) {
        history.push(`/${organizations[0].id}/union`);
        return;
      }

      setOrganizations(organizations);
    })();
  }, []);
  return (
    <NavigationLayout>
      <div>
        {organizations && !organizations.length && (
          <div>
            <p>У вас отсуствуют объединения, которыми вы управляете</p>
            <Button
              onClick={() => {
                window.open(process.env.REACT_APP_CLIENT_APP_URL, config.clientAppWindowName);
                window.close(); // may not work, need to debug
              }}
            >
              Перейти в сервис
            </Button>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
}

export default Home;

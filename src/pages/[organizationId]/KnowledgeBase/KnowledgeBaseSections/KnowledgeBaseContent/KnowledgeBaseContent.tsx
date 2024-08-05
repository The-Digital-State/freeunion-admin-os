import { Route, Switch } from 'react-router-dom';
import { routes } from 'Routes';
import { Box, Typography } from '@material-ui/core';
import Material from './Material/Material';
import MaterialPreview from './MaterialPreview/MaterialPreview';
import Section from './Section/Section';
import SectionPreview from './SectionPreview/SectionPreview';
import LinkMaterial from './LinkMaterial/LinkMaterial';

const KnowledgeBaseContent = () => {
  return (
    <Box
      sx={{
        width: '70%',
        p: 1,
      }}
    >
      <Switch>
        <Route path={routes.kbase.createKbase} exact={true} key={'section-default'}>
          <Typography
            sx={{
              textTransform: 'uppercase',
              fontFamily: 'Jost',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '25px',
              lineHeight: '35px',
            }}
          >
            добавляйте и систематизируйте полезные статьи и документы в вашем объединении
          </Typography>
        </Route>
        <Route path={`${routes.kbase.createKbase}/new`} component={Section} exact={true} key={'section-new'} />
        <Route
          path={`${routes.kbase.sectionKbase}/material/new`}
          component={Material}
          exact={true}
          key={'material-new'}
        />
        <Route path={routes.kbase.sectionKbase} component={SectionPreview} exact={true} key={'section'} />
        <Route
          path={`${routes.kbase.createKbase}/:sectionId/material/:materialId`}
          component={MaterialPreview}
          exact={true}
          key={'material'}
        />
        <Route path={routes.kbase.linkMaterialRoute} component={LinkMaterial} exact={true} key={'linkMaterial'} />
      </Switch>
    </Box>
  );
};

export default KnowledgeBaseContent;

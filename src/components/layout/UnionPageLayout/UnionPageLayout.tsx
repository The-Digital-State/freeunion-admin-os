import { Box, Typography, Avatar, makeStyles } from '@material-ui/core';
import NumberHighlight from '../../atoms/NumberHighlight';
import { Button } from 'shared/components/common/Button/Button';
import { Spinner } from 'shared/components/common/Spinner/Spinner';
import styles from './UnionPageLayout.module.scss';

const useStyles = makeStyles({
  unionLogo: {
    width: 60,
    height: 60,
  },
  unionButton: {
    width: 379,
    borderRadius: 15,
  },
  removeUnionButton: {
    width: '30%',
    marginBottom: 30,
    float: 'right',
    fontSize: 12,
  },
  redirectButton: {
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
});

const UnionPageLayout = ({ children, organization, organizationId, isLoading }) => {
  const classes = useStyles();
  const { data, remove, isDeleted } = organization;

  const unionPageLayoutStyles = {
    backgroundColor: 'background.default',
    p: 3,
    minHeight: '100vh',
    display: 'block',
    justifyContent: 'none',
    alignItems: 'none',
  };

  if (isLoading || isDeleted) {
    unionPageLayoutStyles.display = 'flex';
    unionPageLayoutStyles.justifyContent = 'center';
    unionPageLayoutStyles.alignItems = 'center';
  }

  return (
    <Box sx={unionPageLayoutStyles}>
      {isDeleted ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h1" sx={{ textAlign: 'center' }}>
            Объединение успешно ликвидировано
          </Typography>
          <Button className={classes.redirectButton} to="/">
            ПЕРЕЙТИ НА ГЛАВНУЮ СТРАНИЦУ
          </Button>
        </Box>
      ) : (
        <>
          {!!isLoading ? (
            <div className={styles.wrapperSpinner}>
              <Spinner size={100} borderWidth="8px" color="purple" />
            </div>
          ) : (
            <>
              <Box key="header" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar alt="Логотип объединения" src={data?.avatar} className={classes.unionLogo} />
                  <Typography sx={{ marginLeft: 4 }} variant="h2">
                    {`"${data?.short_name}"`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', height: 50 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: 2,
                    }}
                  >
                    <Typography sx={{ marginRight: 2 }} variant="h6">
                      {`УЧАСТНИКИ: `}
                    </Typography>
                    <NumberHighlight>{data?.members_count}</NumberHighlight>
                  </Box>
                  {/* <Button variant="contained" className={classes.unionButton} disabled>
                    СКРЫТЬ ОБЪЕДИНЕНИЕ
                  </Button> */}
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
              >
                {children}
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <Button
                  icon="bomb"
                  maxWidth
                  onClick={() => {
                    const confirm = window.confirm('Вы действительно хотите ликвидировать данное объединение?');

                    if (confirm) {
                      remove({ organizationId: +organizationId });
                    }
                  }}
                >
                  ЛИКВИДИРОВАТЬ ОБЪЕДИНЕНИЕ
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default UnionPageLayout;

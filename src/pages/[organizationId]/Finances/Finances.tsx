import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import Head from 'react-helmet';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import PaymentCreation from './PaymentCreation/PaymentCreation';
import PaymentsTable from './PaymentsTable/PaymentsTable';
import PaymentsSystemSettings from './PaymentsSystemSettings/PaymentsSystemSettings';
import { getActiveApiPaymentsThunk } from 'redux/slices/finance';
import { toast } from 'react-toastify';
import { useDispatch } from '../../../redux';
import PaymentsCosts from './PaymentsCosts/PaymentsCosts';

export enum FinanceTabConfig {
  creation = 'creation',
  payments = 'payments',
  costs = 'costs',
}

const financePageLayout = {
  backgroundColor: 'background.default',
  p: 3,
  minHeight: '100vh',
  display: 'block',
  justifyContent: 'none',
  alignItems: 'none',
};

const useStyle = makeStyles({
  indicator: {
    top: '0px',
  },
});

const tabs: { label: string; type: string }[] = [
  {
    label: 'Создать',
    type: FinanceTabConfig.creation,
  },
  {
    label: 'Платежи',
    type: FinanceTabConfig.payments,
  },
  {
    label: 'Расходы',
    type: FinanceTabConfig.costs,
  },
];

const Finances = () => {
  const theme = useTheme();
  const classes = useStyle();
  const [tabType, setTabType] = useState(FinanceTabConfig.creation);
  const { organizationId } = useParams<{ organizationId?: string }>();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        dispatch(getActiveApiPaymentsThunk(+organizationId));
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    })();
  }, [organizationId, dispatch]);

  const handleChange = (event: React.SyntheticEvent, newValue: FinanceTabConfig) => {
    setTabType(newValue);
  };

  const sections = [
    {
      title: 'Создание платежной системы',
      details: <PaymentsSystemSettings />,
    },
  ];

  return (
    <>
      <Head>
        <title>Финансы</title>
      </Head>
      <Box sx={financePageLayout}>
        <Typography variant="h2">Финансы</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          {sections.map((section) => (
            <Accordion
              key={section.title}
              defaultExpanded
              sx={{
                borderRadius: 1,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ height: 75 }}
              >
                <Typography variant="h6">{section.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>{section.details}</AccordionDetails>
            </Accordion>
          ))}
          <Box
            sx={{
              backgroundColor: 'background.default',
              minHeight: '100vh',
            }}
          >
            <Card>
              <Tabs
                classes={{ indicator: classes.indicator }}
                indicatorColor="primary"
                scrollButtons="auto"
                textColor="primary"
                value={tabType}
                onChange={handleChange}
                variant="scrollable"
              >
                {tabs.map((tab, index) => (
                  <Tab
                    label={tab.label}
                    value={tab.type}
                    key={index}
                    sx={{
                      color: tabType === tab.type && theme.palette.primary.main,
                      fontWeight: 'bold',
                    }}
                  />
                ))}
              </Tabs>
              <Divider />

              {(() => {
                switch (tabType) {
                  case FinanceTabConfig.creation:
                    return <PaymentCreation setTabType={(type) => setTabType(type)} />;
                  case FinanceTabConfig.payments:
                    return <PaymentsTable />;
                  case FinanceTabConfig.costs:
                    return <PaymentsCosts />;
                }
              })()}
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Finances;

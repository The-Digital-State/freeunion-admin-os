import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import { FormikErrors } from 'formik';
import { mockApi } from 'pages/[organizationId]/Finances/PaymentCreation/PaymentCreation';
import { Button } from 'shared/components/common/Button/Button';
import { ApiPayments } from 'shared/interfaces/finance';

type PaymentApiCheckboxesProps = {
  organizationId: number;
  checkedApi?: boolean;
  setCheckedApi?: (checkedApi: boolean) => void;
  activeApi: ApiPayments[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  validateForm: (values?: any) => Promise<
    FormikErrors<{
      title: any;
      image: any;
      description: any;
      manual_payments: any;
      auto_payments: any;
    }>
  >;
  auto_payments: ApiPayments[];
  auto_payments_values: ApiPayments[];
  is_promotion?: boolean;
};

const PaymentApiCheckboxes = ({
  organizationId,
  checkedApi,
  setCheckedApi,
  activeApi,
  setFieldValue,
  validateForm,
  auto_payments,
  auto_payments_values,
  is_promotion,
}: PaymentApiCheckboxesProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      {!is_promotion && (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedApi}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setFieldValue('auto_payments', []);
                  }
                  setCheckedApi(!checkedApi);
                  setTimeout(() => {
                    validateForm();
                  }, 50);
                }}
              />
            }
            label="Добавить API"
          />
        </FormGroup>
      )}

      {(checkedApi || is_promotion) && (
        <>
          <Box sx={{ ml: 5 }}>
            {mockApi.map((api, index) => {
              return (
                <FormGroup key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={auto_payments?.includes(api)}
                        disabled={!activeApi?.includes(api)}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            const filteredAutoPayments = auto_payments_values.filter((i) => i !== api);
                            setFieldValue('auto_payments', filteredAutoPayments);
                          } else {
                            const filteredAutoPayments = [...auto_payments_values];
                            filteredAutoPayments.push(api);
                            setFieldValue('auto_payments', filteredAutoPayments);
                          }
                        }}
                      />
                    }
                    sx={{ textTransform: 'capitalize' }}
                    label={api}
                  />
                </FormGroup>
              );
            })}
          </Box>
          <Box display={'flex'} alignItems={'center'} sx={{ mt: 2 }}>
            <Button to={`/${organizationId}/api`}>Подключить API</Button>

            <Typography
              sx={{ color: 'blue', ml: 2, cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault();
                document.body.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest',
                });
              }}
            >
              Что такое API?
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PaymentApiCheckboxes;

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { FieldArray, FormikErrors, FormikTouched } from 'formik';
import { PaymentSystems } from 'shared/interfaces/finance';

import TrashIcon from '../../../lib/material-kit/icons/Trash';
import AddIcon from '../../../lib/material-kit/icons/Plus';
import { paymentsSystems } from 'pages/[organizationId]/Finances/PaymentCreation/PaymentCreation';
import Tooltip from 'shared/components/common/Tooltip/Tooltip';

type PaymentLinkInputsProps = {
  touched: FormikTouched<{
    title: any;
    image: any;
    description: any;
    manual_payments: any;
    auto_payments: any;
  }>;
  errors: FormikErrors<{
    title: any;
    image: any;
    description: any;
    manual_payments: any;
    auto_payments: any;
  }>;
  checkedLink: boolean;
  setCheckedLink: (checkedLink: boolean) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  manual_payments_value: {
    payment_link: string;
    payment_system: PaymentSystems;
  }[];
  handleBlur: any;
  handleChange: any;
};

const PaymentLinkInputs = ({
  touched,
  errors,
  checkedLink,
  setCheckedLink,
  setFieldValue,
  manual_payments_value,
  handleBlur,
  handleChange,
}: PaymentLinkInputsProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={checkedLink} />}
          onChange={() => {
            if (checkedLink) {
              setFieldValue('manual_payments', []);
            } else {
              setFieldValue('manual_payments', [
                {
                  payment_system: PaymentSystems.patreon,
                  payment_link: '',
                },
              ]);
            }
            setCheckedLink(!checkedLink);
          }}
          label="Добавить ссылку на оплату/крипто-кошелек"
        />
      </FormGroup>
      {checkedLink && (
        <FieldArray
          name="manual_payments"
          render={(arrayHelpers) => (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              {manual_payments_value.map((payment_info, index) => (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', mt: 3 }} key={index}>
                  <FormControl sx={{ width: '20%', mr: 2 }}>
                    <InputLabel>Платежная система</InputLabel>
                    <Select
                      fullWidth
                      label="Платежная система"
                      name={`manual_payments.${index}.payment_system`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={payment_info.payment_system}
                      variant="outlined"
                    >
                      {paymentsSystems.map(({ value, text }) => {
                        return (
                          <MenuItem
                            key={value}
                            value={value}
                            disabled={!!manual_payments_value.find((i) => i.payment_system === value)}
                          >
                            {text}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ width: '50%' }}
                    error={Boolean(
                      touched &&
                        touched.manual_payments &&
                        touched.manual_payments[index] &&
                        touched.manual_payments[index]?.payment_link &&
                        errors &&
                        errors.manual_payments &&
                        //@ts-ignore
                        errors.manual_payments[index]?.payment_link
                    )}
                    helperText={
                      touched &&
                      touched.manual_payments &&
                      touched.manual_payments[index] &&
                      touched.manual_payments[index]?.payment_link &&
                      errors &&
                      errors.manual_payments &&
                      //@ts-ignore
                      errors.manual_payments[index]?.payment_link
                    }
                    label={
                      [PaymentSystems.bitcoin, PaymentSystems.litecoin, PaymentSystems.ERC20].includes(
                        payment_info.payment_system
                      )
                        ? 'Адрес кошелька'
                        : 'Ссылка на систему оплаты'
                    }
                    name={`manual_payments.${index}.payment_link`}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={payment_info?.payment_link}
                    variant="outlined"
                    placeholder={
                      [PaymentSystems.bitcoin, PaymentSystems.litecoin, PaymentSystems.ERC20].includes(
                        payment_info.payment_system
                      )
                        ? ''
                        : 'https://'
                    }
                  />

                  {manual_payments_value.length > 1 && (
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          arrayHelpers.remove(index);
                        }}
                        data-tip
                        data-for={`deletePaymentSystemTooltip`}
                      >
                        <TrashIcon fontSize="small" />
                      </IconButton>
                      <Tooltip id="deletePaymentSystemTooltip" title="Удалить платежную систему" />
                    </>
                  )}
                  {index === manual_payments_value.length - 1 && manual_payments_value.length < 4 && (
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          const filterPamentsInfo = manual_payments_value.map((i) => i.payment_system);
                          const arr = paymentsSystems
                            .filter(({ value }) => !filterPamentsInfo.includes(value))
                            .map(({ value }) => value);
                          arrayHelpers.push({ payment_system: arr[0], payment_link: '' });
                        }}
                        data-tip
                        data-for={`addPaymentSystemTooltip`}
                      >
                        <AddIcon fontSize="medium" />
                      </IconButton>
                      <Tooltip id="addPaymentSystemTooltip" title="Добавить платежную систему" />
                    </>
                  )}
                </Box>
              ))}
            </Box>
          )}
        />
      )}
    </Box>
  );
};

export default PaymentLinkInputs;

import { Box, Divider, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@material-ui/core';

import { useState } from 'react';
import {
  ApiPayments,
  CurrenciesType,
  currencyLabel,
  PaymentSystems,
  PaymentSystemsText,
  PaymentType,
} from 'shared/interfaces/finance';

import PaymentFundrasing from './PaymentFundrasing/PaymentFundrasing';
import PaymentPromotion from './PaymentPromotion/PaymentPromotion';
import PaymentSubcription from './PaymentSubscribtion/PaymentSubscribtion';

export const paymentsSystems = [
  { value: PaymentSystems.patreon, text: PaymentSystemsText.patreon },
  { value: PaymentSystems.paypal, text: PaymentSystemsText.paypal },
  { value: PaymentSystems.stripe, text: PaymentSystemsText.stripe },
  { value: PaymentSystems.bitcoin, text: PaymentSystemsText.bitcoin },
  { value: PaymentSystems.litecoin, text: PaymentSystemsText.litecoin },
  { value: PaymentSystems.ERC20, text: PaymentSystemsText.ERC20 },
  { value: PaymentSystems.other, text: PaymentSystemsText.other },
];

export const mockApi: ApiPayments[] = [ApiPayments.stripe];

export const currencies = [
  {
    value: CurrenciesType.EUR,
    label: currencyLabel[CurrenciesType.EUR],
  },
  {
    value: CurrenciesType.USD,
    label: currencyLabel[CurrenciesType.USD],
  },
];

const paymentsTypeMock = [
  {
    label: PaymentType.fundraising,
    value: PaymentType.fundraising,
    text:
      'Это денежные переводы, поступающие без каких-либо условий, добровольно, просто потому, что человек разделяет ваши ценности, идеи и хочет поддержать вас материально. При создании карточки добровольного пожертвования, особое внимание уделите описанию того, для чего именно вам нужны средства, куда вы планируете их потратить. Не забывайте благодарить за помощь.',
  },
  {
    label: 'Акционный сбор',
    value: PaymentType.promotional,
    text:
      'Акционный платеж необходим, если вы регулярно собираете деньги для различных нужд и проектов. Расскажите свою историю- для чего вы проводите сбор, сколько нужно собрать, за какой срок и кому это поможет. Чтобы стимулировать скорейший сбор нужной суммы, отобразите в настройках шкалу  сбора средств и таймер времени до окончания акции. Настройте подключение платежной системы через API один раз и вам больше не нужно будет подключать к каждому платежу отдельно.',
  },
  {
    label: PaymentType.subscription,
    value: PaymentType.subscription,
    text:
      'Это регулярные пожертвования в пользу объединения. Деньги автоматически ежемесячно списываются с той карты, которую клиент указывает при оплате. Все списания проводятся безопасным и надежными платежными сервисами и передаются только в зашифрованном виде. Через модуль “Подписки” можно оформить любые виды регулярных платежей, такие как членские взносы и спонсорские пакеты. Чтобы заинтересовать пользователя, добавьте описание или список привилегий для подписчиков, которые будут расширяться по мере увеличения стоимости пакета',
  },
];

const PaymentCreation = ({
  id,
  onClose,
  type,
  setTabType,
}: {
  id?: number;
  onClose?: () => void;
  type?: PaymentType;
  setTabType?: (type: any) => void;
}) => {
  const [paymentsType, setPaymentsType] = useState<PaymentType>(type || PaymentType.fundraising);
  const [textHover, setTextHover] = useState(paymentsTypeMock[0].text);

  const hoverEffect = (index: number) => {
    setTextHover(paymentsTypeMock[index].text);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 3,
          height: id ? 'auto' : '250px',
        }}
      >
        <Grid item md={4} sm={6} xs={12}>
          <Typography sx={{ mb: 1 }}>Тип платежа: {id && type}</Typography>

          {!id && (
            <>
              <RadioGroup name="paymentMethod" sx={{ flexDirection: 'column' }}>
                {paymentsTypeMock.map((paymentTypeMock, index) => (
                  <FormControlLabel
                    control={<Radio color="primary" sx={{ ml: 1 }} />}
                    checked={paymentsType === paymentTypeMock.value}
                    key={paymentTypeMock.value}
                    onMouseOver={() => hoverEffect(index)}
                    onMouseOut={() => hoverEffect(paymentsTypeMock.findIndex((i) => i.value === paymentsType))}
                    onChange={() => setPaymentsType(paymentTypeMock.value)}
                    label={
                      <Typography color="textPrimary" variant="body1">
                        {paymentTypeMock.label}
                      </Typography>
                    }
                    value={paymentTypeMock.value}
                  />
                ))}
              </RadioGroup>
            </>
          )}
        </Grid>

        {!id && (
          <Grid item md={5} sm={7} xs={12}>
            {textHover}
          </Grid>
        )}
      </Box>
      <Divider />
      {(() => {
        switch (paymentsType) {
          case PaymentType.fundraising:
            return <PaymentFundrasing id={id} close={onClose} setTabType={setTabType} />;
          case PaymentType.subscription:
            return <PaymentSubcription id={id} close={onClose} setTabType={setTabType} />;
          case PaymentType.promotional:
            return <PaymentPromotion id={id} close={onClose} setTabType={setTabType} />;
        }
      })()}
    </Box>
  );
};

export default PaymentCreation;

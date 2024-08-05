import { FormikErrors, FormikTouched } from 'formik';

export type QuestionsDescriptionPropsType = {
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  touched: FormikTouched<{
    question: string;
    image: {
      url: string;
      uuid: string;
    };
  }>;
  errors: FormikErrors<{
    question: string;
    image: {
      url: string;
      uuid: string;
    };
  }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  question: string;
  url: string;
  questionId: number;
  questionType: string;
};

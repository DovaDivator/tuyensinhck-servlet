import { FormDataProps } from '../../types/FormInterfaces';

interface OnChangeChoiceProps {
  name: string;
  value: string | string[] | undefined;
  setFormData: React.Dispatch<React.SetStateAction<FormDataProps>>;
}

export const onChangeChoice = ({name, value, setFormData}: OnChangeChoiceProps): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
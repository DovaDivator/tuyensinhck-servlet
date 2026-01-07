import React from "react";
import { InputOptions } from "../../classes/InputOption";
import { FormDataProps } from "../../types/FormInterfaces";


export const onChangeInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFormData: React.Dispatch<React.SetStateAction<FormDataProps>>,
  options: InputOptions = new InputOptions({})
): void => {
  const { name, value } = e.target;
  const valueAfter = onChangeByOption(value, options);
  setFormData(prev => ({ ...prev, [name]: valueAfter }));
};

const onChangeByOption = (
  value: string,
  options: InputOptions = new InputOptions({})
): string => {
  let valueAfter = value;

  if (options.stringCase !== '') {
    valueAfter = onChangeByCase(valueAfter, options.stringCase);
  }
  if (options.restrict) {
    valueAfter = valueAfter.replace(/[^\x00-\x7F]/g, '');
  }
  return valueAfter;
};

const onChangeByCase = (value: string, Case: string): string => {
  switch (Case) {
    case 'upper':
      return value.toUpperCase();
    case 'lower':
      return value.toLowerCase();
    default:
      return value;
  }
};

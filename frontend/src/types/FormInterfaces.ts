import { InputOptions } from "../classes/InputOption";

export interface Unit {
  [key: string]: any;
}

export interface FormDataProps {
  [key: string]: string | string[] | undefined;
}

export interface FileDataProps {
  [key: string]: File | File[] | undefined;
}

export interface ErrorLogProps {
  [key: string]: string | undefined;
}

export interface DataOptionsProps {
  [key: string]: InputOptions;
}

export interface ValidateRule {
  validate: (name: string, value: any, formData?: FormDataProps) => { [key: string]: string };
}

export interface DataValidsProps {
  [key: string]: ValidateRule;
}
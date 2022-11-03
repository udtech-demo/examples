export interface DefInputProps {
  label?: string;
  name?: string;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  classInput?: string;
  defaultValue?: string;
  classWrapper?: string;
  errorText?: string;
  value: string;
  stylesWrapper?: React.CSSProperties;
  stylesInput?: React.CSSProperties;
  readOnly?: boolean;
  onKeyDown?: any;
  autoFocus?: boolean;
}

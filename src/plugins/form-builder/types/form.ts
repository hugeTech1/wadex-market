export interface FieldOption {
  lookup_code: string;
  lookup_name: string;
}

export type FieldType =
  | 'UUID'
  | 'DATETIME'
  | 'SHORT_TXT'
  | 'DATE'
  | 'EMAIL'
  | 'SYS_LKP'
  | 'MULTIPLE_SELECT'
  | 'INT'
  | 'BOOL'
  | 'TABLE_LKP'
  | 'LONG_TXT'
  | 'MEDIUM_TXT'
  | 'URL'
  | 'VIDEO'
  | 'GLOB_LKP'
  | 'ADDRESS'
  | 'SELECT'
  ;

export interface FormField {
  field_name: string;
  field_label: string;
  field_type: FieldType;
  field_subtype: FieldType;
  field_description: string;
  field_options: FieldOption[];
  field_required: string;
  field_hidden: string;
  field_default: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface LandingContent {
  [key: string]: string;
}
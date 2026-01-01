interface FieldItem {
  key: string
  name: string
  label: string
  type: 'input' | 'password' | 'textarea' | 'date' | 'dateRange' | 'select'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any
  rules?: Array<{ required?: boolean; message?: string }>
  options?: {
    placeholder?: string
    width?: string
    height?: string
    addonBefore?: string
    options?: Array<{ value: string; label: string }>
    allowClear?: boolean
    disabled?: boolean
  }
}

interface FieldRow {
  rowKey: string
  fieldCols: Array<FieldItem>
}

interface FormState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

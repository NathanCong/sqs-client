interface ChatMessage {
  messageId: string
  messageRole: string // user | assistant
  messageType: string // text | ?
  messageData: unknown
}

interface CommandInputExecParams {
  userCommand: string
}

type ChatModalExecParams = CommandInputExecParams

type CommonFormItemValue = string | undefined

interface CommonFormItem {
  key: string
  name: string
  label: string
  value?: CommonFormItemValue
  defaultValue?: CommonFormItemValue
  rules?: Array<{ required?: boolean; message?: string }>
  placeholder?: string
  type?: string // input
}

interface CommonFormStyleConfig {
  layout?: string
  colon?: boolean
  labelCol?: { span?: number; offset?: number }
  wrapperCol?: { span?: number; offset?: number }
}

interface CommonFormConfig extends CommonFormStyleConfig {
  fields: Array<CommonFormItem>
}

interface CommonFormState {
  [key: string]: CommonFormItemValue
}

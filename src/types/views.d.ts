interface ChatMessage {
  messageId: string
  messageRole: string // user | assistant
  messageType: string // text | ?
  messageData: string
}

interface CommandInputExecParams {
  userCommand: string
}

interface ChatModalExecParams extends CommandInputExecParams {
  scrollToBottom: () => void
}

/**
 * 登录配置
 */
export const LOGIN_FORM_FIELDS: FieldItem[] = [
  {
    key: 'userEmail',
    name: 'userEmail',
    label: '账号',
    type: 'input',
    rules: [{ required: true, message: '账号不能为空' }],
    options: {
      placeholder: '请输入登录账号（用户邮箱地址）',
      allowClear: true
    }
  },
  {
    key: 'userPassword',
    name: 'userPassword',
    label: '密码',
    type: 'password',
    rules: [{ required: true, message: '密码不能为空' }],
    options: {
      placeholder: '请输入登录密码',
      allowClear: true
    }
  }
]

/**
 * 注册配置
 */
export const REGISTER_FORM_FIELDS: FieldItem[] = [
  {
    key: 'userName',
    name: 'userName',
    label: '用户姓名',
    type: 'input',
    rules: [{ required: true, message: '用户姓名不能为空' }],
    options: {
      placeholder: '请输入用户姓名',
      allowClear: true
    }
  },
  {
    key: 'userPhone',
    name: 'userPhone',
    label: '用户手机号',
    type: 'input',
    rules: [{ required: true, message: '用户手机号不能为空' }],
    options: {
      placeholder: '请输入用户手机号',
      allowClear: true
    }
  },
  {
    key: 'userEmail',
    name: 'userEmail',
    label: '用户邮箱',
    type: 'input',
    rules: [{ required: true, message: '用户邮箱不能为空' }],
    options: {
      placeholder: '请输入用户邮箱',
      allowClear: true
    }
  },
  {
    key: 'userPassword',
    name: 'userPassword',
    label: '登录密码',
    type: 'password',
    rules: [{ required: true, message: '登录密码不能为空' }],
    options: {
      placeholder: '请输入登录密码',
      allowClear: true
    }
  },
  {
    key: 'userPasswordConfirm',
    name: 'userPasswordConfirm',
    label: '确认登录密码',
    type: 'password',
    rules: [{ required: true, message: '确认登录密码不能为空' }],
    options: {
      placeholder: '请输入确认登录密码',
      allowClear: true
    }
  }
]

import request from '@/utils/request'

export const userResgisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', {
    username,
    password,
    repassword
  })
}
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', {
    username,
    password
  })
}

export const getUserInfoService = () => {
  return request.get('/my/userinfo')
}

//更新用户基本资料
export const updateUserInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

//上传头像
export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

//更新密码
export const updatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })

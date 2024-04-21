// 숫자로만 이루어진 11자리 휴대폰번호인지 확인하는 함수
export const validatePhone = (phone: string): boolean => {
  return /^\d{11}$/.test(phone);
};

// 비밀번호가 8자 이상인지 확인하는 함수
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

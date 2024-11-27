export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^[a-zA-Z0-9]{6,20}$/;
  console.log(passwordRegex.test(password));
  return passwordRegex.test(password);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
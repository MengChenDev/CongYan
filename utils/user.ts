export const GetToken = () => {
  return localStorage.getItem("token");
}

export const Logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/";
};
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getRoles = () => {
  const roles = localStorage.getItem("roles");
  return roles ? JSON.parse(roles) : [];
};

export const hasRole = (role: string) => {
  const roles = getRoles();
  return roles.includes(role);
};

export const getToken = () => localStorage.getItem("token");
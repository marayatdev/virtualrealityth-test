export type UserRegister = {
  id?: string;
  f_name: string;
  l_name: string;
  email: string;
  password: string;
};

export type UserLogin = {
  email?: string;
  password: string;
};

export type UserRegister = {
  user_id?: string;
  username: string;
  email: string;
  password: string;
};

export type UserLogin = {
  username?: string;
  email?: string;
  password: string;
};

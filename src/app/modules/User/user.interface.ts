

export interface TUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  state: string;
  zipCode: string;
  role?: string;
  userStatus?:string
  createdAt: Date;
  updatedAt: Date;
}

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};

export type ISocialUser = {
  email: string;
  firstName: string;
  lastName?: string;
  profileImage: string;
};

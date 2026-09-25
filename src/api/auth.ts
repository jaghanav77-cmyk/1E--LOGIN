const API_URL = "/.netlify/functions";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  otp: string;
}

export const getUserByEmail = async (
  email: string
): Promise<User | null> => {
  const response = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error("Unable to connect to the server");
  }

  const users: User[] = await response.json();

  return users.length > 0 ? users[0] : null;
};

export const verifyPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  return user.password === password;
};

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  return user.otp === otp;
};

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const response = await fetch(
    `${API_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        otp,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Unable to create account.");
  }

  return await response.json();
};

export const updatePassword = async (
  email: string,
  newPassword: string
): Promise<User> => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const response = await fetch(
    `${API_URL}/users/${user.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Unable to update password");
  }

  return response.json();
};
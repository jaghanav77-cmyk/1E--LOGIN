import { getStore } from "@netlify/blobs";

const store = getStore("login-users");

const users = [
  // Your existing users from db.json go here
];

export default async () => {
  await store.setJSON("users", users);

  return Response.json({
    success: true,
    message: "Users seeded successfully",
    count: users.length,
  });
};
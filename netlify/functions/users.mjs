import { getStore } from "@netlify/blobs";

const store = getStore("login-users");

async function getUsers() {
  const users = await store.get("users", {
    type: "json",
    consistency: "strong",
  });

  return users || [];
}

async function saveUsers(users) {
  await store.setJSON("users", users);
}

export default async (request) => {
  try {
    const url = new URL(request.url);
    const method = request.method;
    const email = url.searchParams.get("email");

    if (method === "GET") {
      const users = await getUsers();

      if (email) {
        const filteredUsers = users.filter(
          (user) =>
            user.email.toLowerCase() ===
            email.toLowerCase()
        );

        return Response.json(filteredUsers);
      }

      return Response.json(users);
    }

    if (method === "POST") {
      const body = await request.json();

      const users = await getUsers();

      const existingUser = users.find(
        (user) =>
          user.email.toLowerCase() ===
          body.email.toLowerCase()
      );

      if (existingUser) {
        return Response.json(
          {
            message:
              "An account with this email already exists.",
          },
          { status: 409 }
        );
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: body.name,
        email: body.email,
        password: body.password,
        otp: body.otp,
      };

      users.push(newUser);

      await saveUsers(users);

      return Response.json(newUser, {
        status: 201,
      });
    }

    if (method === "PATCH") {
      const pathParts = url.pathname.split("/");
      const userId =
        pathParts[pathParts.length - 1];

      const body = await request.json();
      const users = await getUsers();

      const userIndex = users.findIndex(
        (user) =>
          String(user.id) === String(userId)
      );

      if (userIndex === -1) {
        return Response.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      users[userIndex] = {
        ...users[userIndex],
        ...body,
      };

      await saveUsers(users);

      return Response.json(users[userIndex]);
    }

    return Response.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  } catch (error) {
    console.error("Users function error:", error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
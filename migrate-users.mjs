import fs from "node:fs";

const NETLIFY_SITE =
  "https://1eloginusers.netlify.app/";

const db = JSON.parse(
  fs.readFileSync("./db.json", "utf8")
);

const users = db.users;

console.log(`Found ${users.length} users.`);

for (const user of users) {
  try {
    const response = await fetch(
      `${NETLIFY_SITE}/.netlify/functions/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          otp: user.otp,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.log(
        `❌ ${user.email}: ${result.message || "Failed"}`
      );
      continue;
    }

    console.log(
      `✅ ${user.email} migrated`
    );
  } catch (error) {
    console.log(
      `❌ ${user.email}: ${error.message}`
    );
  }
}

console.log("Migration finished.");
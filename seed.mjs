import { getStore } from "@netlify/blobs";

const store = getStore("login-users");

const users = [
  {
    id: "1",
    email: "you@acmecorp.com",
    password: "password123",
    company: "acmecorp",
    name: "Acme User",
    otp: "123456"
  },
  {
    id: "2",
    name: "Jaghanav",
    email: "jaghanav@acmecorp.com",
    password: "jaghanav123",
    company: "acmecorp",
    otp: "777777"
  },
  {
    id: "3",
    name: "Shaik",
    email: "shaik@acmecorp.com",
    password: "shaik123",
    company: "acmecorp",
    otp: "696969"
  },
  {
    id: "4",
    name: "Dhamodharan",
    email: "dhamodharan@acmecorp.com",
    password: "dhamodharan123",
    company: "acmecorp",
    otp: "101010"
  },
  {
    id: "5",
    name: "Gokul",
    email: "gokul@acmecorp.com",
    password: "gokul123",
    company: "acmecorp",
    otp: "454545"
  },
  {
    id: "6",
    name: "Arun",
    email: "arun@acmecorp.com",
    password: "arun123",
    company: "acmecorp",
    otp: "232323"
  },
  {
    id: "7",
    name: "Karthik",
    email: "karthik@acmecorp.com",
    password: "karthik123",
    company: "acmecorp",
    otp: "909090"
  },
  {
    id: "02oREgcJZKw",
    name: "Jaghanav",
    email: "jaghanav77@gmail.com",
    password: "Jaghanav11*",
    otp: "123456"
  },
  {
    id: "Iqsclf0Iohk",
    name: "Jaghanav",
    email: "jaghanav10@gmail.com",
    password: "Jaghanav10*",
    otp: "123456"
  },
  {
    id: "gb4fOzfRcDs",
    name: "Jaghanav7",
    email: "jaghanav11@gmail.com",
    password: "Jaghanav10*",
    otp: "176729"
  },
  {
    id: "MQofyBP76Gg",
    name: "Jaghanav Priyan M S K",
    email: "jaghanav13@gmail.com",
    password: "Jaghanav10*",
    otp: "971584"
  },
  {
    id: "OGWIs1ZvHVI",
    name: "Jaghanav Priyan M S K",
    email: "jaghanav14@gmail.com",
    password: "Jaghanav10*",
    otp: "707094"
  },
  {
    id: "Evd1_8DmeN4",
    name: "Jaghanav Priyan M S K",
    email: "jaghanav88@gmail.com",
    password: "Jaghanav10*",
    otp: "228348"
  },
  {
    id: "mSoJtTnTnTo",
    name: "Jaghanav Priyan M S K",
    email: "jaghanav89@gmail.com",
    password: "Jaghanav10*",
    otp: "199697"
  },
  {
    id: "oeZQjsEGeKU",
    name: "Jaghanav Priyan M S K",
    email: "jaghanav37@gmail.com",
    password: "Jaghanav10*",
    otp: "267334"
  },
  {
    id: "cgR4HngMHms",
    name: "Jaghanav Priyan M S K",
    email: "jaghanav44@gmail.com",
    password: "H7pHEQgMXi3UjSe",
    otp: "634253"
  }
];

export default async () => {
  try {
    await store.setJSON("users", users);

    return Response.json({
      success: true,
      message: "Users seeded successfully",
      count: users.length
    });
  } catch (error) {
    console.error("Seed error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to seed users"
      },
      {
        status: 500
      }
    );
  }
};
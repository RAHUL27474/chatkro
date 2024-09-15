require("dotenv").config();
const corsOptions = {
  origin: [
    // "https://yestalky.netlify.app",
    "http://localhost:3000",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const CHATTU_TOKEN = "chattu-token";

module.exports= { corsOptions, CHATTU_TOKEN };

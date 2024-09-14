require("dotenv").config();
const corsOptions = {
  origin: [
    "https://yestalky.netlify.app",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const CHATTU_TOKEN = "chattu-token";

module.exports= { corsOptions, CHATTU_TOKEN };

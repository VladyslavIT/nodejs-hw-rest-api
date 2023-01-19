const app = require("./app");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const { HOST_URI, PORT } = process.env;

async function server() {
  try {
    await mongoose.connect(HOST_URI);
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
server();

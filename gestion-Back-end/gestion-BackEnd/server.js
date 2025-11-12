import dotenv from "dotenv";
import { DBConnect } from "./models/DBConnect.js";
import { server } from "./index.js";

dotenv.config();
DBConnect();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
   server.listen(PORT, () => console.log(`Server started on port ${PORT} ***`));
}

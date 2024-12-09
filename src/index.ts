import dotenv from "dotenv";
dotenv.config();

try {
  import("./scheduler.js").catch((error) => {
    console.error("Error importing scheduler:", error);
    process.exit(1);
  });
} catch (error) {
  console.error("Error in index.ts:", error);
  process.exit(1);
}

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

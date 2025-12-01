import Database from "../src/database/Database";

beforeAll(async () => {
  await Database.initialize();
});

afterAll(async () => {
  await Database.close();
});

import retry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator.js";

async function waitForAllServices() {
  await waitForWebServices();

  async function waitForWebServices() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function runPendigMigrations() {
  await migrator.runPendingMigrations();
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendigMigrations,
};

export default orchestrator;

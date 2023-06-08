import app from "./config/express";
import env from "./config/env";
import { iocContainer as Container } from "./config/container";
import { ICronjobService } from "./interfaces/ICronjobService";
import { TYPES } from "./config/types";

const cronJobService = Container.get<ICronjobService>(TYPES.CronjobService);

app.listen(env.API_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at ${env.API_HOST}:${env.API_PORT}`
  );
  console.log(
    `⚡️[server]: API ROOT: ${env.API_HOST}:${env.API_PORT}${env.API_ROOT}/${env.API_VERSION}`
  );
  cronJobService.cronJob();
});

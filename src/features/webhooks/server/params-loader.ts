import { createLoader } from "nuqs/server";
import { secretsParams } from "../params";

export const signingSecretsParamsLoader = createLoader(secretsParams);

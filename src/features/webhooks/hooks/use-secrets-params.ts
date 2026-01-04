import { useQueryStates } from "nuqs"
import { secretsParams } from "../params"

export const useSecretsParams = () => {
    return useQueryStates(secretsParams);
}
import * as objectAssign from "object-assign";

export const customError = (error: any, properties: { [key: string]: any }): { [key: string]: any } => {
    const o = { customError: true, original: error };
    return objectAssign({}, o, properties);
}
import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const AUTH = "AUTH";

export interface AUTHRequest {
  token?: string;
}

const schema: JSONSchemaType<AUTHRequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
  },
  additionalProperties: false,
};
export const validateAUTHRequest = ajv.compile(schema);

export interface AUTHResponse {
  id: string;
  token: string;
}

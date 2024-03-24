import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const SUICIDE = "SUICIDE";

export interface SUICIDERequest {
  token?: string;
}

const schema: JSONSchemaType<SUICIDERequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
  },
  additionalProperties: false,
};

export const validateSUICIDERequest = ajv.compile(schema);

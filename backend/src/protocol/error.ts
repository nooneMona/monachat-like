import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const ERROR = "ERROR";

export interface ERRORRequest {
  text: string;
}

const schema: JSONSchemaType<ERRORRequest> = {
  type: "object",
  properties: {
    text: { type: "string" },
  },
  required: ["text"],
  additionalProperties: false,
};

export const validateERRORRequest = ajv.compile(schema);

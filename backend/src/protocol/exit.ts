import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const EXIT = "EXIT";
export interface EXITRequest {
  token?: string;
}

const schema: JSONSchemaType<EXITRequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
  },
  additionalProperties: false,
};

export const validateEXITRequest = ajv.compile(schema);

export interface EXITResponse {
  id: string;
}

import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const IG = "IG";

export interface IGRequest {
  token?: string;
  stat: string;
  ihash: string;
}

const schema: JSONSchemaType<IGRequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
    stat: { type: "string", enum: ["on", "off"] },
    ihash: { type: "string" },
  },
  required: ["stat", "ihash"],
};

export const validateIGRequest = ajv.compile(schema);

export interface IGResponse {
  id: string;
  stat: string;
  ihash: string;
}

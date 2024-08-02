import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const SIG = "SIG";

export interface SIGRequest {
  token?: string;
  stat: "on" | "off";
  ihash: string;
}

const schema: JSONSchemaType<SIGRequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
    stat: { type: "string", enum: ["on", "off"] },
    ihash: { type: "string" },
  },
  required: ["stat", "ihash"],
};

export const validateSIGRequest = ajv.compile(schema);

export interface SIGResponse {
  id: string;
  stat: "on" | "off";
  ihash: string;
}

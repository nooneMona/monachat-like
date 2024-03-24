import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const SET = "SET";

export interface SETRequest {
  token?: string;
  x: number;
  y: number;
  scl: number;
  stat: string;
  cmd?: string;
  pre?: string;
  param?: string;
  ev?: number;
}

const schema: JSONSchemaType<SETRequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
    x: { type: "integer" },
    y: { type: "integer" },
    scl: { type: "integer" },
    stat: { type: "string", maxLength: 20 },
    cmd: { type: "string", nullable: true },
    pre: { type: "string", nullable: true },
    param: { type: "string", nullable: true },
    // 1 ~ 4ビット分予約
    ev: { type: "integer", nullable: true, minimum: 1, maximum: 2 ** 4 },
  },
  required: ["x", "y", "scl", "stat"],
  additionalProperties: false,
};

export const validateSETRequest = ajv.compile(schema);

export interface SETResponse {
  id: string;
  x: number;
  y: number;
  scl: number;
  stat: string;
  cmd?: string;
  pre?: string;
  param?: string;
  ev?: number;
}

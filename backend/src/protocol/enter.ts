import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const ENTER = "ENTER";

export interface ENTERRequest {
  token?: string;
  room: string;
  attrib?: string;
  // user
  x?: number;
  y?: number;
  scl?: number;
  stat?: string;
  name?: string;
  trip?: string;
  r?: number;
  g?: number;
  b?: number;
  type?: string;
}

const schema: JSONSchemaType<ENTERRequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
    room: { type: "string" },
    attrib: { type: "string", enum: ["no"], nullable: true },
    // user
    x: { type: "integer", nullable: true },
    y: { type: "integer", nullable: true },
    scl: { type: "integer", nullable: true },
    stat: { type: "string", maxLength: 20, nullable: true },
    // ５０文字以上は悪意があるとみなす。
    name: { type: "string", maxLength: 50, nullable: true },
    // ５０文字以上は悪意があるとみなす。
    trip: { type: "string", maxLength: 50, nullable: true },
    r: { type: "integer", minimum: 0, maximum: 100, nullable: true },
    g: { type: "integer", minimum: 0, maximum: 100, nullable: true },
    b: { type: "integer", minimum: 0, maximum: 100, nullable: true },
    // 50文字以上は悪意があるとみなす。
    type: { type: "string", maxLength: 50, nullable: true },
  },
  required: ["room"],
  additionalProperties: false,
};

export const validateENTERRequest = ajv.compile(schema);

export interface ENTERResponse {
  id: string;
  room: string;
  // user
  x?: number;
  y?: number;
  scl?: number;
  stat?: string;
  name?: string;
  ihash?: string;
  trip?: string;
  r?: number;
  g?: number;
  b?: number;
  type?: string;
  isMobile: boolean;
}

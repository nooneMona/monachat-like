import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

export const COM = "COM";

type COMRequestTraditional = {
  token?: string;
  cmt: string;
  style?: number;
};
export type COMRequest = COMRequestTraditional & {
  typing?: {
    count: number;
    milliTime: number;
  };
};

const schema: JSONSchemaType<COMRequest> = {
  type: "object",
  properties: {
    token: { type: "string", nullable: true },
    cmt: { type: "string", maxLength: 500 },
    // 1 ~ 4ビット分予約
    style: { type: "integer", nullable: true, minimum: 1, maximum: 2 ** 4 },
    typing: {
      type: "object",
      nullable: true,
      properties: {
        count: {
          type: "integer",
        },
        milliTime: {
          type: "integer",
        },
      },
      required: ["count", "milliTime"],
    },
  },
  required: ["cmt"],
  additionalProperties: false,
};

export const validateCOMRequest = ajv.compile(schema);

type COMResponseTraditional = {
  id: string;
  cmt: string;
  style?: number;
};
export type COMResponse = COMResponseTraditional & {
  typing?: {
    count: number;
    milliTime: number;
  };
};

import { USER } from "../protocol/user";

export const userData: any = {
  tanaka: (): USER => {
    return {
      id: "id",
      x: 100,
      y: 200,
      scl: 100,
      stat: "通常",
      name: "田中",
      ihash: "aohdahouga",
      trip: "ga;oiw932d",
      r: 100,
      g: 100,
      b: 100,
      type: "mona",
      isMobile: true,
    };
  },
};

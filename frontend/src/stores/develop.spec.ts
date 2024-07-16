import { createPinia, setActivePinia } from "pinia";
import { socketIOInstance } from "../socketIOInstance";
import { useDevStore } from "./develop";
import { useUserStore } from "./user";

const emitMock = vi.fn();
const disconnectMock = vi.fn();
const connectMock = vi.fn();
socketIOInstance.emit = emitMock;
socketIOInstance.disconnect = disconnectMock;
socketIOInstance.connect = connectMock;

describe("Dev Store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("isVisibleFrame", () => {
    it("should be changed by updateMethod", () => {
      const dev = useDevStore();
      expect(dev.isVisibleFrame).toBe(false);
      dev.updateIsVisibleFrame(true);
      expect(dev.isVisibleFrame).toBe(true);
    });
  });

  describe("suicide", () => {
    it("should emit SUICIDE event", () => {
      const dev = useDevStore();
      const user = useUserStore();
      user.$patch({ myToken: "test_token" });

      dev.suicide();

      expect(emitMock).toBeCalledTimes(1);
      expect(emitMock).toHaveBeenNthCalledWith(1, "SUICIDE", { token: "test_token" });
    });
  });

  describe("simulateReconnection", () => {
    it("should call disconnect and then call connect after 3000 minutes", () => {
      const dev = useDevStore();

      dev.simulateReconnection();

      expect(disconnectMock).toBeCalledTimes(1);
      expect(connectMock).toBeCalledTimes(0);

      vi.advanceTimersByTime(3000);

      expect(disconnectMock).toBeCalledTimes(1);
      expect(connectMock).toBeCalledTimes(1);
    });
  });
});

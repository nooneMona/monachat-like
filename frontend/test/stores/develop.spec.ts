import { createPinia, setActivePinia } from "pinia";
import { socketIOInstance } from "@/socketIOInstance";
import { useDevStore } from "@/stores/develop";
import { useUserStore } from "@/stores/user";

const emitMock = vi.fn<typeof socketIOInstance.emit>();
socketIOInstance.emit = emitMock;
const disconnectMock = vi.fn<typeof socketIOInstance.disconnect>();
socketIOInstance.disconnect = disconnectMock;
const connectMock = vi.fn<typeof socketIOInstance.connect>();
socketIOInstance.connect = connectMock;

describe("Dev Store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("isVisibleFrame", () => {
    it("should be changed by updateMethod", () => {
      expect.assertions(2);
      const dev = useDevStore();
      expect(dev.isVisibleFrame).toBe(false);
      dev.updateIsVisibleFrame(true);
      expect(dev.isVisibleFrame).toBe(true);
    });
  });

  describe("suicide", () => {
    it("should emit SUICIDE event", () => {
      expect.assertions(2);
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
      expect.assertions(4);
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

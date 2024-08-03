import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { useNoticeStore } from "@/stores/notice";

describe("useNoticeStore", () => {
  const testingPinia = createTestingPinia();

  beforeEach(() => {
    setActivePinia(testingPinia);
  });

  it("requiredRefresh should be return false", () => {
    expect.assertions(1);
    const noticeStore = useNoticeStore();
    expect(noticeStore.requiredRefresh).toBe(false);
  });

  it("isRequestRefresh should be return false", () => {
    expect.assertions(1);
    const noticeStore = useNoticeStore();
    expect(noticeStore.isRequiredRefresh).toBe(false);
  });

  it("requestedRefresh should set requestRefresh to true", () => {
    expect.assertions(1);
    setActivePinia(createTestingPinia({ stubActions: false }));
    const noticeStore = useNoticeStore();
    noticeStore.requestRefresh();
    expect(noticeStore.isRequiredRefresh).toBe(true);
  });

  it("stopRequestRefresh should set requestRefresh to false", () => {
    expect.assertions(1);
    setActivePinia(
      createTestingPinia({ initialState: { requiredRefresh: true }, stubActions: false }),
    );
    const noticeStore = useNoticeStore();
    noticeStore.stopRefreshRequest();
    expect(noticeStore.isRequiredRefresh).toBe(false);
  });

  it.each([{ selectedVolume: "on" }, { selectedVolume: "off" }])(
    "playCOMAudio should be called when selectvolume is $selectedVolume:",
    async ({ selectedVolume }) => {
      expect.assertions(1);
      setActivePinia(
        createTestingPinia({
          initialState: { setting: { selectedVolume } },
          stubActions: false,
        }),
      );

      const noticeStore = useNoticeStore();
      const audioFn = vi
        .spyOn(window.HTMLAudioElement.prototype, "play")
        .mockResolvedValue(undefined);

      await noticeStore.playCOMAudio();

      expect(audioFn).toHaveBeenCalledTimes(selectedVolume === "on" ? 1 : 0);
    },
  );

  it.each([{ selectedVolume: "on" }, { selectedVolume: "off" }])(
    "playENTERAudio should be called when selectvolume is $selectedVolume:",
    async ({ selectedVolume }) => {
      expect.assertions(1);
      setActivePinia(
        createTestingPinia({
          initialState: { setting: { selectedVolume } },
          stubActions: false,
        }),
      );

      const noticeStore = useNoticeStore();
      const audioFn = vi
        .spyOn(window.HTMLAudioElement.prototype, "play")
        .mockResolvedValue(undefined);

      await noticeStore.playENTERAudio();

      expect(audioFn).toHaveBeenCalledTimes(selectedVolume === "on" ? 1 : 0);
    },
  );
});

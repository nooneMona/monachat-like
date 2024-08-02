import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { useNoticeStore } from "@/stores/notice";

describe("useNoticeStore", () => {
  const testingPinia = createTestingPinia();

  beforeEach(() => {
    setActivePinia(testingPinia);
  });

  it("requiredRefresh should be return false", () => {
    const noticeStore = useNoticeStore();
    expect(noticeStore.requiredRefresh).toBe(false);
  });

  it("isRequestRefresh should be return false", () => {
    const noticeStore = useNoticeStore();
    expect(noticeStore.isRequiredRefresh).toBe(false);
  });

  it("requestedRefresh should set requestRefresh to true", () => {
    setActivePinia(createTestingPinia({ stubActions: false }));
    const noticeStore = useNoticeStore();
    noticeStore.requestRefresh();
    expect(noticeStore.isRequiredRefresh).toBe(true);
  });

  it("stopRequestRefresh should set requestRefresh to false", () => {
    setActivePinia(
      createTestingPinia({ initialState: { requiredRefresh: true }, stubActions: false }),
    );
    const noticeStore = useNoticeStore();
    noticeStore.stopRefreshRequest();
    expect(noticeStore.isRequiredRefresh).toBe(false);
  });

  it.each([
    { selectedVolume: "on", shouldCall: true },
    { selectedVolume: "off", shouldCall: false },
  ])(
    "playCOMAudio should be called when selectvolume is $selectedVolume:",
    ({ selectedVolume, shouldCall }) => {
      const isShouldbeCalled: boolean = shouldCall;
      setActivePinia(
        createTestingPinia({
          initialState: { setting: { selectedVolume } },
          stubActions: false,
        }),
      );

      const noticeStore = useNoticeStore();
      const audioFn = vi
        .spyOn(window.HTMLAudioElement.prototype, "play")
        .mockImplementation(() => Promise.resolve());

      noticeStore.playCOMAudio();

      if (isShouldbeCalled) {
        expect(audioFn).toHaveBeenCalled();
      } else {
        expect(audioFn).not.toHaveBeenCalled();
      }
    },
  );

  it.each([
    { selectedVolume: "on", shouldCall: true },
    { selectedVolume: "off", shouldCall: false },
  ])(
    "playENTERAudio should  be called when selectvolume is $selectedVolume",
    ({ selectedVolume, shouldCall }) => {
      const isShouldbeCalled: boolean = shouldCall;
      setActivePinia(
        createTestingPinia({
          initialState: { setting: { selectedVolume } },
          stubActions: false,
        }),
      );

      const noticeStore = useNoticeStore();
      const audioFn = vi
        .spyOn(window.HTMLAudioElement.prototype, "play")
        .mockImplementation(() => Promise.resolve());

      noticeStore.playENTERAudio();

      if (isShouldbeCalled) {
        expect(audioFn).toHaveBeenCalled();
      } else {
        expect(audioFn).not.toHaveBeenCalled();
      }
    },
  );

  it("reloadpage should be called window.location.reload", () => {
    setActivePinia(
      createTestingPinia({
        stubActions: false,
      }),
    );
    const noticeStore = useNoticeStore();
    const windowReload = vi.spyOn(window.location, "reload").mockImplementation(() => {});
    noticeStore.reloadPage();
    expect(windowReload).toHaveBeenCalled();
  });
});

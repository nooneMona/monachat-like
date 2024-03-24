import { indexGetters } from "./getters";

describe("roomObj", () => {
  it("roomオブジェクトを取得できるかどうか", () => {
    const id = "/3";
    const state = {
      roomMetadata: [
        { id: "/1", name: "もなちゃと", img_url: "st1.svg" },
        { id: "/2", name: "祭り", img_url: "st2.svg" },
        { id: "/3", name: "貞子", img_url: "st3.svg" },
        { id: "/4", name: "樹海", img_url: "st4.svg" },
        { id: "/5", name: "廃墟", img_url: "st5.svg" },
        { id: "/6", name: "ﾊｧ?", img_url: "st6.svg" },
        { id: "/7", name: "キラキラ", img_url: "st7.svg" },
        { id: "/8", name: "ｻｯ", img_url: "st8.svg" },
        { id: "/9", name: "食い逃げ", img_url: "st9.svg" },
        { id: "/10", name: "学校", img_url: "st10.svg" },
        { id: "/11", name: "喫茶", img_url: "st11.svg" },
        { id: "/12", name: "Flash", img_url: "st12.svg" },
        { id: "/13", name: "東京精神病院", img_url: "st13.svg" },
        { id: "/14", name: "ヲタ", img_url: "st14.svg" },
        { id: "/15", name: "さいたま", img_url: "saitama.svg" },
        { id: "/16", name: "BARギコ", img_url: "bargiko.svg" },
        { id: "/17", name: "ワショーイ堂", img_url: "wasyoido.svg" },
        { id: "/18", name: "神社", img_url: "jinja.svg" },
        { id: "/19", name: "やまなし", img_url: "yamanasi.svg" },
        { id: "/20", name: "流石兄弟", img_url: "sasuga.svg" },
        { id: "/21", name: "もなちゃと21", img_url: "st1.svg" },
        { id: "/22", name: "もなちゃと22", img_url: "st1.svg" },
        { id: "/23", name: "もなちゃと23", img_url: "st1.svg" },
        { id: "/24", name: "もなちゃと24", img_url: "st1.svg" },
        { id: "/25", name: "もなちゃと25", img_url: "st1.svg" },
        { id: "/26", name: "もなちゃと26", img_url: "st1.svg" },
        { id: "/27", name: "もなちゃと27", img_url: "st1.svg" },
        { id: "/28", name: "もなちゃと28", img_url: "st1.svg" },
        { id: "/29", name: "もなちゃと29", img_url: "st1.svg" },
        { id: "/30", name: "もなちゃと30", img_url: "st1.svg" },
      ],
    };
    const result = indexGetters.roomObj(state)(id);
    expect(result).toEqual({
      id: "/3",
      name: "貞子",
      img_url: "st3.svg",
    });
  });
});

describe("visiableUsers", () => {
  it("1人", () => {
    const state = {
      idsIgnoresMe: {},
      ihashsIgnoredByMe: {},
      users: {
        "001": {
          alive: true,
          ihash: "hoge",
        },
      },
    };
    const result = indexGetters.visibleUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        ihash: "hoge",
      },
    });
  });
  it("2人こちら側が無視", () => {
    const state = {
      idsIgnoresMe: {},
      ihashsIgnoredByMe: { hoge2: "on" },
      users: {
        "001": {
          alive: true,
          ihash: "hoge",
        },
        "002": {
          alive: true,
          ihash: "hoge2",
        },
      },
    };
    const result = indexGetters.visibleUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        ihash: "hoge",
      },
    });
  });
  it("3人こちら側が1人を無視2人から無視", () => {
    const state = {
      idsIgnoresMe: { "002": "on", "003": "on" },
      ihashsIgnoredByMe: { hoge2: "on" },
      users: {
        "001": {
          alive: true,
          ihash: "hoge",
        },
        "002": {
          alive: true,
          ihash: "hoge2",
        },
        "003": {
          alive: true,
          ihash: "hoge3",
        },
      },
    };
    const result = indexGetters.visibleUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        ihash: "hoge",
      },
    });
  });
  it("5人こちら側が1人を無視1人から無視1人がSLEEP", () => {
    const state = {
      idsIgnoresMe: { "002": "on" },
      ihashsIgnoredByMe: { hoge4: "on" },
      users: {
        "001": {
          alive: true,
          ihash: "hoge",
        },
        "002": {
          alive: true,
          ihash: "hoge2",
        },
        "003": {
          alive: false,
          ihash: "hoge3",
        },
        "004": {
          alive: true,
          ihash: "hoge4",
        },
        "005": {
          alive: true,
          ihash: "hoge5",
        },
      },
    };
    const result = indexGetters.visibleUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        ihash: "hoge",
      },
      "005": {
        alive: true,
        ihash: "hoge5",
      },
    });
  });
});
describe("manageableUsers", () => {
  it("1人", () => {
    const state = {
      idsIgnoresMe: {},
      ihashsIgnoredByMe: {},
      users: {
        "001": {
          alive: true,
        },
      },
    };
    const result = indexGetters.manageableUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        isIgnored: false,
      },
    });
  });
  it("2人居て相手を無視", () => {
    const state = {
      idsIgnoresMe: {},
      ihashsIgnoredByMe: { hoge2: "on" },
      users: {
        "001": {
          alive: true,
          ihash: "hoge",
        },
        "002": {
          alive: true,
          ihash: "hoge2",
        },
      },
    };
    const result = indexGetters.manageableUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        ihash: "hoge",
        isIgnored: false,
      },
      "002": {
        alive: true,
        ihash: "hoge2",
        isIgnored: "on",
      },
    });
  });
  it("3人がいて1人を無視,1人から無視", () => {
    const state = {
      idsIgnoresMe: { "003": "on" },
      ihashsIgnoredByMe: { hoge2: "on" },
      users: {
        "001": {
          alive: true,
          ihash: "hoge",
        },
        "002": {
          alive: true,
          ihash: "hoge2",
        },
        "003": {
          alive: true,
          ihash: "hoge3",
        },
      },
    };
    const result = indexGetters.manageableUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        ihash: "hoge",
        isIgnored: false,
      },
      "002": {
        alive: true,
        ihash: "hoge2",
        isIgnored: "on",
      },
    });
  });
  it("3人がいて1人を無視,1人がSLEEP", () => {
    const state = {
      idsIgnoresMe: {},
      ihashsIgnoredByMe: { hoge2: "on" },
      users: {
        "001": {
          alive: true,
          ihash: "hoge",
        },
        "002": {
          alive: true,
          ihash: "hoge2",
        },
        "003": {
          alive: false,
          ihash: "hoge3",
        },
      },
    };
    const result = indexGetters.manageableUsers(state);
    expect(result).toEqual({
      "001": {
        alive: true,
        ihash: "hoge",
        isIgnored: false,
      },
      "002": {
        alive: true,
        ihash: "hoge2",
        isIgnored: "on",
      },
    });
  });
});
describe("silentUsers", () => {
  it("サイレント無視していない時", () => {
    const state = {
      ihashsSilentIgnoredByMe: {},
      users: {
        "001": {
          ihash: "hoge",
        },
        "002": {
          ihash: "hoge2",
        },
        "003": {
          ihash: "hoge3",
        },
      },
    };
    const result = indexGetters.silentUsers(state);
    expect(result).toEqual({});
  });
  it("2人こちら側から1人サイレント無視している", () => {
    const state = {
      ihashsSilentIgnoredByMe: { hoge2: true },
      users: {
        "001": {
          ihash: "hoge",
        },
        "002": {
          ihash: "hoge2",
        },
        "003": {
          ihash: "hoge3",
        },
      },
    };
    const result = indexGetters.silentUsers(state);
    expect(result).toEqual({
      "002": {
        ihash: "hoge2",
      },
    });
  });
});
describe("idsByihash", () => {
  it("きちんとihashがはいっているか", () => {
    const state = {
      users: {
        "001": {
          ihash: "hoge",
        },
      },
    };

    const result = indexGetters.idsByIhash(state);
    expect(result).toEqual({
      hoge: ["001"],
    });
  });

  it("同じihashでちがうid", () => {
    const state = {
      users: {
        ryusuke: {
          ihash: "hoge",
        },
        kisuke: {
          ihash: "hoge",
        },
      },
    };

    const result = indexGetters.idsByIhash(state);
    expect(result).toEqual({
      hoge: ["ryusuke", "kisuke"],
    });
  });

  it("違うihashでちがうid", () => {
    const state = {
      users: {
        ryusuke: {
          ihash: "hoge",
        },
        kisuke: {
          ihash: "hoge2",
        },
      },
    };

    const result = indexGetters.idsByIhash(state);
    expect(result).toEqual({
      hoge: ["ryusuke"],
      hoge2: ["kisuke"],
    });
  });
  it("だれもいない", () => {
    const state = {
      users: {},
    };

    const result = indexGetters.idsByIhash(state);
    expect(result).toEqual({});
  });
});

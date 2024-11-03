const { default: axios } = require("axios");

const URL = "http://localhost:8000";
const WS_URL = "http://localhost:8001";

describe("User Authentication", () => {
  let username;
  let password;
  test("User doesn't provide username", async () => {
    const response = await axios.post(URL + "/api/v1/signup");
    expect(response.statusCode).toBe(400);
  });
  test("User provides username", async () => {
    username = "pradeep-" + Math.random();
    password = "123456";
    const response = await axios.post(URL + "/api/v1/signup", {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(200);
  });
  test("User provides wrong password", async () => {
    const response = await axios.post(URL + "/api/singin", {
      username,
      password: "Wrongpassword",
    });
    expect(response.statusCode).toBe(400);
  });
  test("User provides wrong username", async () => {
    const response = await axios.post(URL + "/api/singin", {
      username: "WrongUserName",
      password,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Successfull Sign in", async () => {
    const response = await axios.post(URL + "/api/singin", {
      username,
      password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.data.token).toBeDefined();
  });
});

describe("User meta data", () => {
  let adminUserName;
  let adminPassword;
  let token;
  let avatarId;
  beforeAll(async () => {
    adminUserName = "admin-" + Math.random();
    adminPassword = "123456";
    await axios.post(URL + "/api/v1/signup", {
      username: adminUserName,
      password: adminPassword,
      type: "admin",
    });
    const { data } = await axios.post(URL + "/api/v1/signin", {
      username: adminUserName,
      password: adminPassword,
    });
    token = data.token;
  });

  test("Create an Avatar without token", async () => {
    const response = await axios.post(URL + "/api/v1/admin/avatar");
    expect(response.statusCode).toBe(403);
  });
  test("Create an Avatar with token", async () => {
    const response = await axios.post(
      URL + "/api/v1/admin/avatar",
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    avatarId = response.data.avatarId;
    expect(response.statusCode).toBe(200);
  });
  test("Update meta data without token", async () => {
    const response = await axios.get(URL + "/api/v1/user/metadata");
    expect(response.statusCode).toBe(403);
  });
  test("Update meta data without token", async () => {
    const response = await axios.post(
      URL + "/api/v1/user/metadata",
      {
        avatarId,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });
});

describe("Get the avatars", () => {
  let adminUserName;
  let adminPassword;
  let token;
  let userId;
  let avatarId;
  beforeAll(async () => {
    adminUserName = "admin-" + Math.random();
    adminPassword = "123456";
    const { data: signUpResponse } = await axios.post(URL + "/api/v1/signup", {
      username: adminUserName,
      password: adminPassword,
      type: "admin",
    });
    userId = signUpResponse.userId;
    const { data } = await axios.post(URL + "/api/v1/signin", {
      username: adminUserName,
      password: adminPassword,
    });
    token = data.token;
    const { data: createAvatarResponse } = await axios.post(
      URL + "/api/v1/admin/avatar",
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    avatarId = createAvatarResponse.avatarId;
  });
  test("Get the user avatar details", async () => {
    const response = await axios.get(
      URL + `/api/v1/user/metadata/bulk?ids=[${userId}]`
    );
    expect(response.statusCode).toBe(200);
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });
  test("Get list of avatars", async () => {
    const response = await axios(URL + "/api/v1/avatars");
    expect(response.statusCode).toBe(200);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((e) => e.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Spaces", () => {
  let token;
  const username = "admin" + Math.random();
  const password = "12345";
  let element1Id = "";
  let element2Id = "";
  let mapId = "";
  let spaceId = "";
  beforeAll(async () => {
    const response = await axios.post(URL + "/api/v1/signup", {
      username,
      password,
      type: "admin",
    });
    userId = response.data.userId;
    const { data: signInData } = await axios.post(URL + "/api/v1/signin", {
      username,
      password,
    });
    token = signInData.token;

    const { data: createElement1ResponseData } = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "http://localhost:3000",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    element1Id = createElement1ResponseData.id;
    const { data: createElement2ResponseData } = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "http://localhost:3000",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    element2Id = createElement2ResponseData.id;

    const { data: createMarketResponseData } = await axios.post(
      URL + "/api/v1/admin/map",
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 30,
            y: 30,
          },
        ],
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    mapId = createMarketResponseData.mapId;
  });
  test("Create space without token", async () => {
    const response = await axios.post(URL + "/api/v1/space", {
      name: "Test",
      dimensions: "100x200",
      mapId: mapId,
    });
    expect(response.statusCode).toBe(403);
  });

  test("Create space without mapId ", async () => {
    const response = await axios.post(URL + "/api/v1/space", {
      name: "Test1",
      dimensions: "100x200",
    });
    expect(response.data.spaceId).toBeDefined();
    expect(response.statusCode).toBe(200);
  });

  test("Create space without mapId and dimensions ", async () => {
    const response = await axios.post(URL + "/api/v1/space", {
      name: "Test2",
      dimensions: "100x200",
    });
    expect(response.statusCode).toBe(400);
  });
  test("Create space without name", async () => {
    const response = await axios.post(URL + "/api/v1/space", {
      dimensions: "100x200",
      mapId: mapId,
    });
    expect(response.statusCode).toBe(400);
  });
  test("Create space with token", async () => {
    const response = await axios.post(
      URL + "/api/v1/space",
      {
        name: "Space",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    spaceId = response.data.spaceId;
    expect(response.statusCode).toBe(200);
    expect(response.data.spaceId).toBeDefined();
  });
  test("Get All spaces without token", async () => {
    const response = await axios.get(URL + "/api/v1/space/all");
    expect(response.statusCode).toBe(403);
  });
  test("Get All spaces with token", async () => {
    const response = await axios.get(URL + "/api/v1/space/all", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    expect(response.data.spaces.length).toBe(1);
    expect(response.statusCode).toBe(200);
  });

  test("Delete space without token", async () => {
    const response = await axios.delete(URL + "/api/v1/space/" + spaceId);
    expect(response.statusCode).toBe(403);
  });
  test("Delete a space that doesn't exists", async () => {
    const response = await axios.delete(URL + "/api/v1/space/randomId", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    expect(response.statusCode).toBe(400);
  });
  test("Delete space with token and the space exists", async () => {
    const response = await axios.delete(URL + "/api/v1/space/" + spaceId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    expect(response.statusCode).toBe(200);
  });
  test("Get All spaces with token after deleting", async () => {
    const response = await axios.get(URL + "/api/v1/space/all", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    expect(response.data.spaces.length).toBe(0);
    expect(response.statusCode).toBe(200);
  });
});

describe("Arena", () => {
  let token;
  const username = "admin" + Math.random();
  const password = "12345";
  let element1Id = "";
  let element2Id = "";
  let spaceElement1Id = "";
  let spaceElement2Id = "";
  let mapId = "";
  let spaceId = "";
  beforeAll(async () => {
    const response = await axios.post(URL + "/api/v1/signup", {
      username,
      password,
      type: "admin",
    });
    userId = response.data.userId;
    const { data: signInData } = await axios.post(URL + "/api/v1/signin", {
      username,
      password,
    });
    token = signInData.token;

    const { data: createElement1ResponseData } = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "http://localhost:3000",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    element1Id = createElement1ResponseData.id;
    const { data: createElement2ResponseData } = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "http://localhost:3000",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    element2Id = createElement2ResponseData.id;

    const { data: createMarketResponseData } = await axios.post(
      URL + "/api/v1/admin/map",
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 30,
            y: 30,
          },
        ],
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    mapId = createMarketResponseData.mapId;
    const spaceResponse = await axios.post(URL + "/api/v1/space", {
      name: "Test",
      dimensions: "100x200",
      mapId: mapId,
    });
    spaceId = spaceResponse.data.spaceId;
  });

  test("Get space by Id", async () => {
    const response = await axios.get(URL + "/api/v1/space/" + spaceId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    expect(response.data).toBeDefined();
  });
  test("Get space by Id which does not exists", async () => {
    const response = await axios.get(URL + "/api/v1/space/randomId", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    expect(response.statusCode).toBe(400);
  });
  test("Add element to the space", async () => {
    const response = await axios.post(
      URL + "/api/v1/space/element",
      {
        elementId: element1Id,
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    spaceElement1Id = response.data.spaceElementId;
    expect(response.statusCode).toBe(200);
  });
  test("Add element to the space without elementId", async () => {
    const response = await axios.post(
      URL + "/api/v1/space/element",
      {
        spaceId: spaceId,
        x: 50,
        y: 20,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  test("Add element to the space without spaceId", async () => {
    const response = await axios.post(
      URL + "/api/v1/space/element",
      {
        elementId: element1Id,
        x: 50,
        y: 20,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  test("Delete an element which does not exist in the space", async () => {
    const response = await axios.delete(
      URL + "/api/v1/space/element",
      {
        spaceId: spaceId,
        elementId: "element1Id",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });
  test("Delete an space element", async () => {
    const response = await axios.delete(
      URL + "/api/v1/space/element",
      {
        spaceId: spaceId,
        elementId: spaceElement1Id,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(200);
  });
  test("Get all the elements", async () => {
    const response = await axios.get(URL + "/api/v1/elements", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.elements.length).toBeDefined(2);
  });
});

describe("Admin Map", () => {
  let token;
  const username = "admin" + Math.random();
  const password = "12345";
  let element1Id = "";
  let element2Id = "";
  let mapId = "";
  let spaceId = "";
  let userToken = "";
  beforeAll(async () => {
    const response = await axios.post(URL + "/api/v1/signup", {
      username,
      password,
      type: "admin",
    });
    userId = response.data.userId;
    const { data: signInData } = await axios.post(URL + "/api/v1/signin", {
      username,
      password,
    });
    token = signInData.token;

    const userResponse = await axios.post(URL + "/api/v1/signup", {
      username,
      password,
      type: "user",
    });
    const { data: signInDataUser } = await axios.post(URL + "/api/v1/signin", {
      username,
      password,
    });
    userToken = signInData.token;
  });

  test("Create an element with normal user", async () => {
    const response = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );
    expect(response.statusCode).toBe(403);
  });
  test("Create an element", async () => {
    const response = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(200);
    expect(response.data).toBeDefined();
  });
  test("Create an element without width and height", async () => {
    const response = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  test("Update an element by normal user", async () => {
    const elementResponse = await axios.post(URL + "/api/v1/admin/element", {
      imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
      width: 1,
      height: 1,
      static: true,
    });
    const response = await axios.put(
      URL + "/api/v1/admin/element/" + elementResponse.data.id,
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=UPDATED",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(200);
    expect(response.data).toBeDefined();
  });
  test("Update an element", async () => {
    const elementResponse = await axios.post(URL + "/api/v1/admin/element", {
      imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
      width: 1,
      height: 1,
      static: true,
    });
    const response = await axios.put(
      URL + "/api/v1/admin/element/" + elementResponse.data.id,
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=UPDATED",
      },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );
    expect(response.statusCode).toBe(200);
    expect(response.data).toBeDefined();
  });
  test("Update an element which does not exits", async () => {
    const response = await axios.put(
      URL + "/api/v1/admin/element/random",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=UPDATED",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  test("Create an Avatar", async () => {
    const response = await axios.post(
      URL + "/api/v1/admin/avatar",
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        name: "Timmy",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(200);
    expect(response.data).toBeDefined();
  });
  test("Create an Avatar without image", async () => {
    const response = await axios.post(
      URL + "/api/v1/admin/avatar",
      {
        name: "Timmy",
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  test("Create a Map", async () => {
    const element1Response = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const element2Response = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const response = await axios.post(
      URL + "/api/v1/admin/map",
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Response.data.id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Response.data.id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Response.data.id,
            x: 19,
            y: 20,
          },
          {
            elementId: element1Response.data.id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    expect(response.statusCode).toBe(200);
    expect(response.data).toBeDefined();
  });
});

describe("Websocket Tests", () => {
  let adminToken = "";
  let user1Token = "";
  let user2Token = "";
  let ws1 = "";
  let ws2 = "";
  let spaceId = "";
  const ws1Messages = [];
  const ws2Messages = [];
  let adminX = "";
  let adminY = "";
  let userX = "";
  let userY = "";
  let adminId=""
  const setHttp = async () => {
    let adminUserName = "admin" + Math.random();
    let adminPassword = "12334";
    const signUpAdminResponse = await axios.post(URL + "/api/v1/signup", {
      username: adminUserName,
      password: adminPassword,
      type: "admin",
    });
    adminId = signUpAdminResponse.data.id
    const signInAdminResponse = await axios.post(URL + "/api/v1/signin", {
      username: adminUserName,
      password: adminPassword,
    });
    adminToken = signInAdminResponse.data.token;

    const createElement1 = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );

    const createElement2 = await axios.post(
      URL + "/api/v1/admin/element",
      {
        imageUrl: "https://encryptsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );
    const map = await axios.post(
      URL + "/api/v1/admin/map",
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: createElement1.data.id,
            x: 20,
            y: 20,
          },
          {
            elementId: createElement1.data.id,
            x: 18,
            y: 20,
          },
          {
            elementId: createElement2.data.id,
            x: 19,
            y: 20,
          },
          {
            elementId: createElement2.data.id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    let user1Name = "user1-" + Math.random();
    const signUpUser1Response = await axios.post(URL + "/api/v1/signup", {
      username: user1Name,
      password: "12344",
      type: "user",
    });
    const signInUser1Response = await axios.post(URL + "/api/v1/signin", {
      username: user1Name,
      password: "12344",
    });
    let user2Name = "user2-" + Math.random();
    const signUpUser2Response = await axios.post(URL + "/api/v1/signup", {
      username: user2Name,
      password: "12345",
      type: "user",
    });
    const signInUser2Response = await axios.post(URL + "/api/v1/signin", {
      username: user2Name,
      password: "12345",
    });
    const createSpace = await axios.post(
      URL + "/api/v1/space",
      {
        name: "Test",
        dimensions: "100x200",
        mapId: map.data.mapId,
      },
      {
        headers: {
          Authorization: "Bearer " + signInUser1Response.data.token,
        },
      }
    );
    spaceId = createSpace.data.spaceId;
  };
  const waitForAndPopLatestMessage = (messages = []) => {
    return new Promise((resolve) => {
      if (messages.length > 0) {
        return resolve(messages.shift());
      } else {
        const interval = setInterval(() => {
          if (messages.length > 0) {
            clearInterval(interval);
            return resolve(messages.shift());
          }
        }, 500);
      }
    });
  };
  const setWs = async () => {
    ws1 = new WebSocket(WS_URL);
    ws2 = new WebSocket(WS_URL);
    await new Promise((resolve) => {
      ws1.onopen = resolve;
    });
    await new Promise((resolve) => {
      ws2.onopen = resolve;
    });
    ws1.onmessage = (event) => {
      ws1Messages.push(JSON.parse(event));
    };
    ws2.onmessage = (event) => {
      ws2Messages.push(JSON.parse(event));
    };
  };

  beforeAll(async () => {
    setHttp();
    setWs();
  });
  test("test if the user receives acknowledge after joining the space", async () => {
    ws1.send(
      JSON.stringify({
        event: "join",
        payload: {
          spaceId,
          token: adminToken,
        },
      })
    );
    const message1 = await waitForAndPopLatestMessage(ws1Messages);
    ws2.send(
      JSON.stringify({
        event: "join",
        payload: {
          spaceId,
          token: user1Token,
        },
      })
    );
    const message2 = await waitForAndPopLatestMessage(ws2Messages)
    const message3 = await waitForAndPopLatestMessage(ws1Messages)

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");
    expect(message3.type).toBe("user-join")

    expect(message1.payload.users.length).toBe(0)
    expect(message2.payload.users.length).toBe(1)
   
    expect(message3.payload.userId).toBe(userId)

    expect(message3.payload.x).toBe(message2.payload.spawn.x)
    expect(message3.payload.y).toBe(message2.payload.spawn.y)

    adminX = message1.payload.spawn.x
    adminY = message1.payload.spawn.y

    userY = message2.payload.spawn.x
    userY = message2.payload.spawn.y
  });
  test("users should not move outside the walls",async()=>{
    ws1.send(JSON.stringify({
        type:"move",
        payload:{
            x:9999999,
            y:4
        }
    }))
    const message1 = await waitForAndPopLatestMessage(ws1Messages)
    expect(message1.type).toBe("movement-reject")
    expect(message1.payload.x).toBe(adminX)
    expect(message1.payload.y).toBe(adminY)
  })
  test("users should not move 4 blocks at a time",async()=>{
    ws1.send(JSON.stringify({
        type:"move",
        payload:{
            x:adminX+4,
            y:adminY
        }
    }))
    const message = await waitForAndPopLatestMessage(ws1Messages)
    expect(message.type).toBe("movement-rejected")
    expect(message.payload.x).toBe(adminX)
    expect(message.payload.y).toBe(adminY)
  })
  test("users moves with proper movement",async()=>{
    ws1.send(JSON.stringify({
        type:"move",
        payload:{
            x:adminX+1,
            y:adminY
        }
    }))
    const message = await waitForAndPopLatestMessage(ws2Messages)
    expect(message.type).toBe("movement")
    expect(message.payload.x).toBe(adminX+1)
    expect(message.payload.y).toBe(adminY)
  })
  test("If the user leaves the room",async()=>{
    ws1.close()
    const message = await waitForAndPopLatestMessage(ws2Messages)
    expect(message.type).toBe("user-left")
    expect(message.payload.userId).toBe(adminId)
  })
});

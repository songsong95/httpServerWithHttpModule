//const { json } = require("express");
const http = require("http");
//const { title } = require("process");
const server = http.createServer();
const fs = require("fs");

const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];
const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 2,
  },
];

const forLoop = () => {
  const data = [];

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      if (users[i].id === posts[j].userId) {
        let updatePost = {
          userId: users[i].id,
          userName: users[i].name,
          postingId: posts[j].userId,
          postingTitle: posts[j].title,
          postingContent: posts[j].content,
        };
        data.push(updatePost);
      }
    }
  }
  return data;
};

const httpRequestListener = function (request, response) {
  const { url, method } = request;
  if (method === "GET") {
    if (url === "/home") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "안녕하세요!" }));
    } else if (url === "/checkList") {
      response.writeHead(200, { "Content-Type": "appliction/json" });
      response.end(JSON.stringify({ data: posts }));
    }
  } else if (method === "POST") {
    // (3)
    if (url === "/join") {
      let body = ""; // (4)

      request.on("data", (data) => {
        body += data;
      }); // (5)

      // stream을 전부 받아온 이후에 실행
      request.on("end", () => {
        // (6)
        const user = JSON.parse(body); //(7)

        users.push({
          // (8)
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "userCreated!", data: users })); // (9)
      });
    }
    if (url === "/posts") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });
      request.on("end", () => {
        const post = JSON.parse(body);

        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId, // else if (method === "DELETE") {
          //   if (url === "/delete") {
          //     let body = "";

          //     request.on("data", (data) => {
          //       body += data;
          //     });

          //     request.on("end", () => {
          //       const post = JSON.parse(body);

          //       posts.push({
          //         id: post.id,
          //         title: post.title,
          //         content: post.content,
          //         userId: post.userId,
          //       });
          //       response.writeHead(200, { "Content-Type": "application/json" });
          //       response.end({ message: "삭제 전", data: posts });
          //     });

          //     fs.unlink(`data/${"/delete"}`, function (error) {
          //       response.writeHead(200, { Location: `/` });
          //       response.end(JSON.stringify({ message: "postingDeleted" }));
          //     });
          //   }
          // }
        });
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "postCreated", data: posts }));
      });
    }
  } else if (method === "PATCH") {
    if (url === "/update") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const post = JSON.parse(body);
        const arr = [];

        arr.push(forLoop());

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "수정 완료!", data: arr }));
      });
    }
  } else if (method === "DELETE") {
    if (url === "/delete") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const post = JSON.parse(body);

        for (let i = 0; posts.length; i++) {
          if (posts[i].id === post.id) {
            posts.splice(i, 1);
            break;
          }
        }

        // posts.push({
        //   id: post.id,
        //   title: post.title,
        //   content: post.content,
        //   userId: post.userId,
        // });
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "삭제 전", data: posts }));
      });
    }
  }
};

server.on("request", httpRequestListener);

// const IP = "127.0.0.1";
// const PORT = 8000;

server.listen(8000, "127.0.0.1", function () {
  console.log(`확인 IP & PORT`);
});

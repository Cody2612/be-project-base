const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});


  describe("/api/anything", () => {
    test("GET: 404 - responds with msg: End point not found", () => {
      return request(app)
        .get("/anything")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("End point not found");
        });
    });
 
  
  describe("/api/topics", () => {
    test("GET:200 - responds with all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.topics.forEach((topic) => {
            expect(Object.keys(topic).length).toBe(2);
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
    
  });
});
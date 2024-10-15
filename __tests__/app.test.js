const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});


describe("/api", ()=>{
    test("Get: 200 - responds with all the endpoints", ()=>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(typeof body.endpoints).toBe("object");
            expect(body.endpoints).toEqual(endpoints);
        });
    })
})

describe("General error handling", () => {
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
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(Object.keys(topic).length).toBeGreaterThan(0);
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
    
  });
});
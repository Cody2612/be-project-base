const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => {
  return seed(data)
});

afterAll(() => {
  
  return db.end()
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

describe("/api/articles/:article_id", () => {
  test("GET:200 - responds with the article matching the article id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 4,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("GET:404 - responds with 'Article not found' for a non-existent article ID", () => {
    const inexistentId = 999;
    return request(app)
      .get(`/api/articles/${inexistentId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("GET:400 - responds with 'Invalid Id type' for an invalid article ID", () => {
    return request(app)
      .get(`/api/articles/invalidId`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Id type");
      });
  });
});

describe('/api/articles', () => {
  test('GET:200 - responds with all the articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);

        body.articles.forEach(article => {
          expect(Object.keys(article).length).toBeGreaterThan(0); 
          expect(typeof article.author).toBe('string');
          expect(typeof article.title).toBe('string');
          expect(typeof article.article_id).toBe('number');
          expect(typeof article.topic).toBe('string');
          expect(typeof article.created_at).toBe('string');
          expect(typeof article.votes).toBe('number');
          expect(typeof article.article_img_url).toBe('string');
          expect(typeof article.comment_count).toBe('string');
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 - responds with all the comments matching the passed article id in a descending order", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((comment) =>{
          expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: 4,
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String)
            })
          })
      });
  });
});

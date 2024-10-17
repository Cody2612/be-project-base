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

describe("GET - /api/articles/:article_id/comments", () => {
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

describe("POST - /api/articles/:article_id/comments",()=>{
  test("POST:201 - creates a comment for an article and responds with it", () => {
  const testComment ={
    username: "butter_bridge",
    body: "Hmm, I'm so bad I don't care anymore",
  };
  return request(app)
    .post("/api/articles/4/comments")
    .send(testComment)
    .expect(201)
    .then(({ body }) => {
      expect(body.comment).toMatchObject({
        comment_id: expect.any(Number),
        body: "Hmm, I'm so bad I don't care anymore",
        article_id: 4,
        author: "butter_bridge",
        votes: expect.any(Number),
        created_at: expect.any(String)
      });
    });
  });

  test("POST:201 - ignore unnecessary properties when creating a comment",()=> {
    const testComment ={
      username: "butter_bridge",
      body: "Hmm, I'm so bad I don't care anymore",
      hat: "Useless thing here"
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Hmm, I'm so bad I don't care anymore",
          article_id: 4,
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String)
        });
      });
  })
  
  test("POST:400 - Invalid Id",()=> {
    const testComment ={
      username: "butter_bridge",
      body: "Hmm, I'm so bad I don't care anymore",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Id type");
    });
  })
  
  test("POST:400 - Missing required fields - username, body or both",()=> {
    const testComment ={
      body: "Hmm, I'm so bad I don't care anymore"
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields");
    });
  });
 
  
  test("POST:404 - valid article id but doesn't exist",()=> {
    const testComment ={
      username: "butter_bridge",
      body: "Hmm, I'm so bad I don't care anymore",
    };
    return request(app)
      .post("/api/articles/6666/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
        });
  });
  
});

describe ("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 - successful increment of votes on the selected article", () => {
    const updatedVotes = { inc_votes : 4}

    return request(app)
    .patch("/api/articles/4")
    .send(updatedVotes)
    .expect(200)
    .then(({body}) =>{
      expect(body.article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 4,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: 4,
        article_img_url: expect.any(String),
      })
    })
  })
  
  test("PATCH:400 - Invalid Id", () => {
    const updatedVotes = { inc_votes : 4}

    return request(app)
    .patch("/api/articles/invalid_id")
    .send(updatedVotes)
    .expect(400)
    .then(({body}) =>{
      expect(body.msg).toBe("Invalid Id type");
    })
  })
  
  test("PATCH:400 - Missing required field - e.g. inc_votes",()=> {

    return request(app)
      .patch("/api/articles/4")
      .send({})
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields");
    });
  });

  test("PATCH:404 - valid article id but doesn't exist", () => {
    const updatedVotes = { inc_votes: 4}
    return request(app)
      .patch("/api/articles/6666")
      .send(updatedVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
        });
  })
})


    


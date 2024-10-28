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

describe("/api/users", () => {
  test("GET:200 - responds with all users", () => {
      return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
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
          comment_count: expect.any(Number)
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
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });
  
  test('GET:200 - responds with all the articles sorted by the default value of created_at in a descending manner', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
        expect(body.articles).toHaveLength(13);

        body.articles.forEach(article => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });
  
  test('GET:200 - responds with all the articles sorted by a different value e.g author in an ascending manner', () => {
    return request(app)
      .get('/api/articles?sort_by=author&&order=ASC')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { ascending: true });
        expect(body.articles).toHaveLength(13);

        body.articles.forEach(article => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });
  
  test('GET:200 - responds with a descending list sorted by votes in a descending manner with a topic of mitch', () => {
    return request(app)
      .get('/api/articles?topic=mitch&sort_by=created_at&order=DESC')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {descending: true});
        body.articles.forEach(article =>{
          expect(article.topic).toBe("mitch");
        })
      });
  });
  
  test('GET:200 - responds with an empty array when there are no articles for the specific topic', () => {
    return request(app)
      .get('/api/articles?topic=pinguin')
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach(article =>{
          expect(article.articles).toEqual([]);
        })
      });
  });
  
  test('GET:200 - responds with all the articles sorted by the provided topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach(article =>{
          expect(article.topic).toBe("mitch");
        })
      });
  });
  
  test('GET:400 - responds with Invalid sort query if invoked with an invalid query e.g password', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid_query')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query")
      });
  });
  
  test('GET:400 - responds with Invalid order by query if invoked with an invalid query e.g order by password', () => {
    return request(app)
      .get('/api/articles?order=invalid_order_by')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query")
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

describe("DELETE /api/comments/:comment_id",()=>{
  test("DELETE:204 - successfully deleting comments by the comment_id", ()=>{
    return request(app)
    .delete("/api/comments/4")
    .expect(204);
  })
  
  test("DELETE:400 - Invalid Id type", ()=>{
    return request(app)
    .delete("/api/comments/invalid_id")
    .expect(400)
    .then(({body}) =>{
      expect(body.msg).toBe("Invalid Id type");
    })
  });

  test("DELETE:404 - valid comment id but doesn't exist", ()=>{
    return request(app)
    .delete("/api/comments/6666")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Article not found");
    })
  });
});



  



    


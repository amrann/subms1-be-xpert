const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 400 when missing authentification', async () => {
      const server = await createServer(container);

      const requestPayload = {
        content: 'content dari comments thread'
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/{threadId}/comments',
        payload: requestPayload
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(authResponse.payload);

      const requestPayload = {
        title: 'title',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/{threadId}/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 201 and new comment', async () => {
      const server = await createServer(container);

      // AUTH
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(authResponse.payload);

      // THREAD
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          body: 'body thread',
          title: 'title thread'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const parsedPayload = JSON.parse(threadResponse.payload)
      const owner = parsedPayload.data.addedThread.owner;
      const threadId = parsedPayload.data.addedThread.id;

      // COMMENT
      const requestPayload = {
        content: 'content dari comments thread',
        owner: owner,
        threadId: threadId
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 400 when missing authentification', async () => {
      const server = await createServer(container);

      const requestPayload = {
        threadId: 'thread-123',
        commentId: 'comment-123'
      };

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/{threadId}/comments/{commentId}',
        payload: requestPayload
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when id thread not found', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(authResponse.payload);

      const requestPayload = {
        threadId: 'thread-123',
        commentId: 'comment-123'
      };

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/{threadId}/comments/{commentId}',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 200 when property is valid', async () => {
      const server = await createServer(container);

      // AUTH
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const { data: { accessToken } } = JSON.parse(authResponse.payload);

      // THREAD
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          body: 'body thread',
          title: 'title thread'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const parsedThreadPayload = JSON.parse(threadResponse.payload)
      const owner = parsedThreadPayload.data.addedThread.owner;
      const threadId = parsedThreadPayload.data.addedThread.id;

      // COMMENT
      const requestThreadPayload = {
        content: 'content dari comments thread',
        owner: owner,
        threadId: threadId
      };

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestThreadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const parsedCommentPayload = JSON.parse(commentResponse.payload)
      const commentId = parsedCommentPayload.data.addedComment.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});

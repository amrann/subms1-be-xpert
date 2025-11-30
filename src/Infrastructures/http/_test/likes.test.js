const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeCommentsTableTestHelper = require('../../../../tests/LikeCommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikeCommentsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 400 when missing authentification', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/{threadId}/comments/{commentId}/likes'
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
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
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'content dari comments thread',
          owner: owner,
          threadId: threadId
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const parsedCommentPayload = JSON.parse(commentResponse.payload)
      const commentId = parsedCommentPayload.data.addedComment.id;

      // LIKE
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
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

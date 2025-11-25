const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyUser = require('../../../Domains/replies/entities/ReplyUser');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should return reply comment user correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({ 
        id: 'thread-123',
        title: 'title dari thread',
        body: 'body dari thread',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123', 
      });

      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123'
      });

      const replyUser = new ReplyUser({
        content: 'content dari reply',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      const fakeIdReplyGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdReplyGenerator);

      // Action
      await replyRepositoryPostgres.addReply(replyUser);

      // Assert
      const repyResult = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(repyResult).toHaveLength(1);
    });
  });

  describe('deleteReplyComment function', () => {
    it('should return undefined when reply comment does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const result = await replyRepositoryPostgres.deleteReplyComment('reply-999');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return comment id and is_delete when reply comment is successfully deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({ 
        id: 'thread-123',
        title: 'title dari thread',
        body: 'body dari thread',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123', 
      });

      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123'
      });

      await RepliesTableTestHelper.addReply({ 
        id: 'reply-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      // Action
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const result = await replyRepositoryPostgres.deleteReplyComment('reply-123');

      // Assert
      expect(result).toEqual({ id: 'reply-123', is_deleted: true });
    });
  });

  describe('checkOwnerOfReply function', () => {
    it('should throw AuthorizationError when owner does not match comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({ 
        id: 'thread-123',
        title: 'title dari thread',
        body: 'body dari thread',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123', 
      });

      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123'
      });

      await RepliesTableTestHelper.addReply({ 
        id: 'reply-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkOwnerOfReply('reply-123', 'user-999'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({ 
        id: 'thread-123',
        title: 'title dari thread',
        body: 'body dari thread',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123', 
      });

      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123'
      });

      await RepliesTableTestHelper.addReply({ 
        id: 'reply-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkOwnerOfReply('reply-999', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when owner matches comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({ 
        id: 'thread-123',
        title: 'title dari thread',
        body: 'body dari thread',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123', 
      });

      await CommentsTableTestHelper.addComment({ 
        id: 'comment-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123'
      });

      await RepliesTableTestHelper.addReply({ 
        id: 'reply-123',
        content: 'content dari comment',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.checkOwnerOfReply('reply-123', 'user-123'))
        .resolves.not.toThrow();
    });
  });
});
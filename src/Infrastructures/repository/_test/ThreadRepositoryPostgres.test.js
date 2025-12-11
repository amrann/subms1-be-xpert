const LikeCommentsTableTestHelper = require('../../../../tests/LikeCommentsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadUser = require('../../../Domains/threads/entities/ThreadUser');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should return thread user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdUserGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdUserGenerator);

      await userRepositoryPostgres.addUser(registerUser);

      const threadUser = new ThreadUser({
        title: 'title dari thread',
        body: 'body dari thread',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
      });
      const fakeIdThreadGenerator = () => 'xWy123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdThreadGenerator);

      // Action
      await threadRepositoryPostgres.addThread(threadUser);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadsById('thread-xWy123');
      expect(thread).toHaveLength(1);

    });
  });

  describe('getThreadById function', () => {
    it('should return threadId correctly', async () => {
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

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-123')).resolves.not.toThrow();
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return commentId correctly', async () => {
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

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.getCommentsByThreadId('comment-123')).resolves.not.toThrow();
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return replyId correctly', async () => {
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
        content: 'content dari reply',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.getRepliesByThreadId('reply-123')).resolves.not.toThrow();
    });
  });

  describe('getLikeCountByCommentIds function', () => {
    it('should return commentId correctly', async () => {
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

      await LikeCommentsTableTestHelper.addLikeComment({ 
        id: 'like-123',
        timestamp: '2025-11-09 03:31:59.941',
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123'
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const result = await threadRepositoryPostgres.getLikeCountByCommentIds(['comment-123']);

      // Assert
      expect(result[0]).toEqual({
        comment_id: 'comment-123',
        like_count: '1', // PostgreSQL returns count as string
      });
    });
  });

  describe('checkThreadExist function', () => {
    it('should throw NotFoundError when thread does not exist', async () => {
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

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkThreadExist('thread-999')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread exists', async () => {
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

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkThreadExist('thread-123')).resolves.not.toThrow();
    });
  });
});
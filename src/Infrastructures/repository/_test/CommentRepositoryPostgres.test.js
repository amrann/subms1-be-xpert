const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentUser = require('../../../Domains/comments/entities/CommentUser');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should return comment user correctly', async () => {
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

      const commentUser = new CommentUser({
        content: 'content dari comment',
        owner: 'user-123',
        threadId: 'thread-123'
      });

      const fakeIdCommentGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdCommentGenerator);

      // Action
      await commentRepositoryPostgres.addComment(commentUser);

      // Assert
      const commentResult = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(commentResult).toHaveLength(1);
    });
  });

  describe('deleteCommentThread function', () => {
    it('should return undefined when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Act
      const result = await commentRepositoryPostgres.deleteCommentThread('comment-999');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return comment id and is_delete when comment is successfully deleted', async () => {
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

      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const result = await commentRepositoryPostgres.deleteCommentThread('comment-123');

      // Assert
     expect(result).toEqual({ id: 'comment-123', is_delete: true });
    });
  });

  describe('checkCommentExist function', () => {
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentExist('comment-999')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when comment exists', async () => {
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.checkCommentExist('comment-123')).resolves.not.toThrow();
    });
  });

  describe('checkOwnerOfComment function', () => {
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkOwnerOfComment('comment-123', 'user-999'))
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkOwnerOfComment('comment-999', 'user-123'))
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.checkOwnerOfComment('comment-123', 'user-123'))
        .resolves.not.toThrow();
    });

  });
});
const LikeCommentsTableTestHelper = require('../../../../tests/LikeCommentsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeComment = require('../../../Domains/likes/entities/LikeComment');
const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await LikeCommentsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('checkCommentLike function', () => {
    it('should return true when "like" exist', async () => {
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
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        timestamp: '2025-11-09 03:31:59.941',
      });

      // Assert
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});

      // Action
      await expect(likeCommentRepositoryPostgres.checkCommentLike('user-123', 'comment-123')).resolves.toBe(true);
    });

    it('should return false when "like" not found', async () => {
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
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        timestamp: '2025-11-09 03:31:59.941',
      });

      // Assert
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});

      // Action
      await expect(likeCommentRepositoryPostgres.checkCommentLike('user-12345', 'comment-123')).resolves.toBe(false);
    });
  });

  describe('putLikeComment function', () => {
    it('should put "like" correctly', async () => {
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

      const likeComment = new LikeComment({
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const fakeIdLikeCommentGenerator = () => '123';
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdLikeCommentGenerator);

      // Action
      await likeCommentRepositoryPostgres.putLikeComment(likeComment.owner, likeComment.threadId, likeComment.commentId);

      // Assert
      const likeCommentResult = await LikeCommentsTableTestHelper.findLikeCommentById('like-123');
      expect(likeCommentResult).toHaveLength(1);
    });
  });

  describe('deleteLikeComment function', () => {
    it('should delete "like" comment correctly', async () => {
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
        owner: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        timestamp: '2025-11-09 03:31:59.941',
      });

      // Assert
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      await likeCommentRepositoryPostgres.deleteLikeComment('user-123', 'comment-123');

      const afterDelete = await pool.query({
        text: 'SELECT id FROM t_comments_likes WHERE owner = $1 AND comment_id = $2',
        values: ['user-123', 'comment-123'],
      });

      // Action
      expect(afterDelete.rowCount).toBe(0);
    });
  });
});
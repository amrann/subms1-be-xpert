const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeCommentsTableTestHelper = {
  async addLikeComment({
    id = 'like-defaultId123',
    owner = 'user-defaultId123',
    threadId = 'thread-defaultId123',
    commentId = 'comment-defaultId123',
    timestamp = '2025-11-09 03:31:59.941'
  }) {
    const query = {
      text: 'INSERT INTO t_comments_likes VALUES ($1, $2, $3, $4, $5)',
      values: [id, owner, threadId, commentId, timestamp],
    };
    await pool.query(query);
  },

  async findLikeCommentById(id) {
    const query = {
      text: 'SELECT * FROM t_comments_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM t_comments_likes WHERE 1=1');
  },
};

module.exports = LikeCommentsTableTestHelper;
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-defaultId123',
    content = 'default content dari comment',
    timestamp = '2025-11-09 03:31:59.941',
    owner = 'user-defaultId123',
    threadId = 'thread-defaultId123',
    commentId = 'comment-defaultId123'
  }) {
    const query = {
      text: 'INSERT INTO t_replies VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, timestamp, owner, threadId, commentId, false],
    };
    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM t_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM t_replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
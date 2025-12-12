const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(threadUser) {
    const { title, body, owner } = threadUser;
    const id = `thread-${this._idGenerator()}`;
    const timestamp = new Date().toISOString();

    const query = {
      text: 'INSERT INTO t_threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, timestamp, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadById(threadId) {
    const query = {
      text: `
        SELECT t_threads.id, t_threads.title, t_threads.body, 
          t_threads.timestamp as date, u.username
        FROM t_threads
        JOIN users u ON t_threads.owner = u.id
        WHERE t_threads.id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, u.username, c.timestamp as date, c.content, c.is_delete
        FROM t_comments c
        JOIN users u ON c.owner = u.id
        WHERE c.thread_id = $1
        ORDER BY c.timestamp ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `
        SELECT r.id, r.comment_id, r.timestamp AS date, r.content, r.is_deleted, u.username
        FROM t_replies r
        JOIN users u ON r.owner = u.id
        WHERE r.thread_id = $1
        ORDER BY r.timestamp ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getLikeCountByCommentIds(commentIds) {
    const query = {
      text: `
        SELECT comment_id, COUNT(*) AS like_count
        FROM t_comments_likes
        WHERE comment_id = ANY($1)
        GROUP BY comment_id
      `,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
  
  async checkThreadExist(id) {
    const query = {
      text: 'SELECT * FROM t_threads WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
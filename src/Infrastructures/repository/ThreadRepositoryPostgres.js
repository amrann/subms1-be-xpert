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

  async getDetailThread(threadId) {
    const threadQuery = {
      text: `SELECT t_threads.id, t_threads.title, t_threads.body, 
                    t_threads.timestamp as date, u.username
            FROM t_threads
            JOIN users u ON t_threads.owner = u.id
            WHERE t_threads.id = $1`,
      values: [threadId],
    };
    const commentsQuery = {
      text: `SELECT c.id, u.username, c.timestamp as date, c.content
            FROM t_comments c
            JOIN users u ON c.owner = u.id
            WHERE c.thread_id = $1
            ORDER BY c.timestamp ASC`,
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);
    const commentsResult = await this._pool.query(commentsQuery);

    return {
      thread: threadResult.rows[0],
      comments: commentsResult.rows
    };
  }

  async addComment(commentUser) {
    const { content, owner, threadId } = commentUser;
    const id = `comment-${this._idGenerator()}`;
		const timestamp = new Date().toISOString();

    const query = {
      text: 'INSERT INTO t_comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner, thread_id',
      values: [id, content, timestamp, owner, threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
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
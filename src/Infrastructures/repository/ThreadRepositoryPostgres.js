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
const InvariantError = require('../../Commons/exceptions/InvariantError');
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
}

module.exports = ThreadRepositoryPostgres;
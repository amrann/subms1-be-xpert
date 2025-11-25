const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(replyUser) {
    const { content, owner, threadId, commentId } = replyUser;
    const id = `reply-${this._idGenerator()}`;
		const timestamp = new Date().toISOString();
    
    const query = {
      text: `
        INSERT INTO t_replies (id, content, timestamp, owner, thread_id, comment_id, is_deleted)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, content, owner
      `,
      values: [id, content, timestamp, owner, threadId, commentId, false],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
  
  async deleteReplyComment(replyId) {
    const query = {
      text: `
        UPDATE t_replies
        SET is_deleted = TRUE
        WHERE id = $1
        RETURNING id, is_deleted
      `,
      values: [replyId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async checkOwnerOfReply(replyId, owner) {
    const query = {
			text: 'SELECT * FROM t_replies WHERE id = $1',
			values: [replyId],
		};

		const result = await this._pool.query(query);

    if (result.rows.length) {
      const { owner: replyOwner } = result.rows[0];
      if (replyOwner !== owner) {
        throw new AuthorizationError('Anda tidak berhak mengakses reply ini');
      }
    } else {
      throw new NotFoundError('Reply tidak ditemukan');
    }
	}
}

module.exports = ReplyRepositoryPostgres;
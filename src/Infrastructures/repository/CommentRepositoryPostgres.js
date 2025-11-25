const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(commentUser) {
    const { content, owner, threadId } = commentUser;
    const id = `comment-${this._idGenerator()}`;
		const timestamp = new Date().toISOString();
    
    const query = {
      text: `
        INSERT INTO t_comments (id, content, timestamp, owner, thread_id, is_delete)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, content, owner, thread_id
      `,
      values: [id, content, timestamp, owner, threadId, false],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteCommentThread(commentId) {
    const query = {
      text: `
        UPDATE t_comments
        SET is_delete = TRUE
        WHERE id = $1
        RETURNING id, is_delete
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async checkCommentExist(id) {
    const query = {
      text: 'SELECT * FROM t_comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async checkOwnerOfComment(commentId, owner) {
    const query = {
			text: 'SELECT * FROM t_comments WHERE id = $1',
			values: [commentId],
		};

		const result = await this._pool.query(query);

    if (result.rows.length) {
      const { owner: commentOwner } = result.rows[0];
      if (commentOwner !== owner) {
        throw new AuthorizationError('Anda tidak berhak mengakses comment ini');
      }
    } else {
      throw new NotFoundError('Comment tidak ditemukan');
    }
	}
}

module.exports = CommentRepositoryPostgres;
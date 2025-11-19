const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
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
      text: `SELECT c.id, u.username, c.timestamp as date, c.content, c.is_delete
            FROM t_comments c
            JOIN users u ON c.owner = u.id
            WHERE c.thread_id = $1
            ORDER BY c.timestamp ASC`,
      values: [threadId],
    };
    const repliesQuery = {
      text: `SELECT r.id, r.comment_id, r.timestamp AS date, r.content, r.is_deleted, u.username
            FROM t_replies r
            JOIN users u ON r.owner = u.id
            WHERE r.thread_id = $1
            ORDER BY r.timestamp ASC`,
      values: [threadId],
    };


    const threadResult = await this._pool.query(threadQuery);
    const commentsResult = await this._pool.query(commentsQuery);
    const repliesResult = await this._pool.query(repliesQuery);

    return {
      thread: threadResult.rows[0],
      comments: commentsResult.rows,
      replies: repliesResult.rows
    };
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

module.exports = ThreadRepositoryPostgres;
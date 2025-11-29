const LikeCommentRepository = require('../../Domains/likes/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkCommentLike(owner, commentId) {
    const query = {
      text: `SELECT id FROM t_comments_likes WHERE owner = $1 AND comment_id = $2`,
      values: [owner, commentId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async putLikeComment(owner, threadId, commentId) {
    const id = `like-${this._idGenerator()}`;
		const timestamp = new Date().toISOString();
    
    const query = {
      text: `
        INSERT INTO t_comments_likes (id, owner, thread_id, comment_id, timestamp)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (comment_id, owner) DO NOTHING
        RETURNING id, owner, thread_id, comment_id, timestamp
      `,
      values: [id, owner, threadId, commentId, timestamp],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deleteLikeComment(owner, commentId) {
    const query = {
      text: `DELETE FROM t_comments_likes WHERE owner = $1 AND comment_id = $2`,
      values: [owner, commentId],
    };

    await this._pool.query(query);
  }

  async likeUnlikeComment(commentUser) {
    const { owner, threadId, commentId } = commentUser;

    const isLiked = await this.checkCommentLike(owner, commentId);

    if (isLiked) {
      await this.deleteLikeComment(owner, commentId);
    } else {
      const like = await this.putLikeComment(owner, threadId, commentId);
    }
  }
}

module.exports = LikeCommentRepositoryPostgres;
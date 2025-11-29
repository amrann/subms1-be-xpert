class LikeComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.owner = payload.owner;
    this.threadId = payload.threadId
    this.commentId = payload.commentId
  }

  _verifyPayload(payload) {
    const { owner, threadId, commentId } = payload;

    if (!owner || !threadId || !commentId) {
      throw new Error('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeComment;
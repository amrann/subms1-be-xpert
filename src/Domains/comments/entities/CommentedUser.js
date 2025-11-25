class CommentedUser {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { threadId, commentId } = payload;

    if (!commentId || !threadId) {
      throw new Error('COMMENTED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error('COMMENTED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentedUser;
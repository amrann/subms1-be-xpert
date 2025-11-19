class RepliedUser {
  constructor(payload) {
    this._verifyPayload(payload);

    this.owner = payload.owner;
    this.threadId = payload.threadId
    this.commentId = payload.commentId
    this.replyId = payload.replyId;
  }

  _verifyPayload(payload) {
    const { owner, threadId, commentId, replyId } = payload;

    if (!owner || !threadId || !commentId || !replyId) {
      throw new Error('REPLY_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('REPLY_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RepliedUser;
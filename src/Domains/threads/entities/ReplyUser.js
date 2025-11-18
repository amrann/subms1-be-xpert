class ReplyUser {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.owner = payload.owner;
    this.threadId = payload.threadId
    this.commentId = payload.commentId
  }

  _verifyPayload(payload) {
    const { content, owner, threadId, commentId } = payload;

    if (!content || !owner || !threadId || !commentId) {
      throw new Error('REPLY_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('REPLY_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyUser;
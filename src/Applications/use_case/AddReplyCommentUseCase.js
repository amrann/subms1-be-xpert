const ReplyUser = require('../../Domains/threads/entities/ReplyUser');

class AddReplyCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const replyUser = new ReplyUser(useCasePayload);
    const { threadId, commentId } = replyUser;

    await this._threadRepository.checkThreadExist(threadId);
    await this._threadRepository.checkCommentExist(commentId);

    return this._threadRepository.addReply(replyUser);
  }
}

module.exports = AddReplyCommentUseCase;

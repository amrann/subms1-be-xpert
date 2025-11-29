const LikeComment = require('../../Domains/likes/entities/LikeComment');

class PutLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(useCasePayload) {
    const likeComment = new LikeComment(useCasePayload);
    const { owner, threadId, commentId } = likeComment;
    
    await this._threadRepository.checkThreadExist(threadId);
    await this._commentRepository.checkCommentExist(commentId);

    const isLiked = await this._likeCommentRepository.checkCommentLike(owner, commentId);

    if (isLiked) {
      await this._likeCommentRepository.deleteLikeComment(owner, commentId);
    } else {
      await this._likeCommentRepository.putLikeComment(owner, threadId, commentId);
    }
  }
}

module.exports = PutLikeCommentUseCase;
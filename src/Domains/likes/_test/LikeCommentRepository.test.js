const LikeCommentRepository = require('../LikeCommentRepository');

describe('LikeCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const likeCommentRepository = new LikeCommentRepository();

    await expect(likeCommentRepository.checkCommentLike('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.putLikeComment('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.deleteLikeComment('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
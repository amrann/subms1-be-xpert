const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment of thread action correctly', async () => {
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-234',
      commentId: 'comment-567'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkOwnerOfComment = jest.fn()
      .mockImplementation(() => Promise.resolve());  
    mockCommentRepository.deleteCommentThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExist).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkOwnerOfComment).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteCommentThread).toHaveBeenCalledWith(useCasePayload.commentId);
  });
});

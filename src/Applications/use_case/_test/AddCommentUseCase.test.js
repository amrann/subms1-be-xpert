const CommentUser = require('../../../Domains/comments/entities/CommentUser');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'content of comment',
      owner: 'user-123',
      threadId: 'thread-234'
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId
      }));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId);
    expect(addedComment).toStrictEqual({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId
    });
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new CommentUser({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId
      }));
    expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);
  });
});

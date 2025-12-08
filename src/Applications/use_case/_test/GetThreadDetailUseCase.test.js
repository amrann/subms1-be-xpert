const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    const mockDataFromRepository = {
      thread: {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2025-11-19T07:00:00.000Z',
        username: 'dicoding',
      },
      comments: [
        {
          id: 'comment-1',
          username: 'userA',
          date: '2025-11-20T07:00:00.000Z',
          content: 'Comment content',
          is_delete: false,
        },
        {
          id: 'comment-2',
          username: 'userB',
          date: '2025-11-21T07:00:00.000Z',
          content: 'Comment deleted',
          is_delete: true,
        },
      ],
      replies: [
        {
          id: 'reply-1',
          comment_id: 'comment-1',
          content: 'Reply content',
          is_deleted: false,
          date: '2025-11-22T07:00:00.000Z',
          username: 'userC',
        },
        {
          id: 'reply-2',
          comment_id: 'comment-2',
          content: 'Reply deleted',
          is_deleted: true,
          date: '2025-11-22T07:10:00.000Z',
          username: 'userD',
        },
      ],
      likes: [
        { comment_id: 'comment-1', like_count: '3' },
        { comment_id: 'comment-2', like_count: '1' },
      ],
    };

    const expectedMappedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-11-19T07:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'userA',
          date: '2025-11-20T07:00:00.000Z',
          content: 'Comment content',
          likeCount: 3,
          replies: [
            {
              id: 'reply-1',
              content: 'Reply content',
              date: '2025-11-22T07:00:00.000Z',
              username: 'userC',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'userB',
          date: '2025-11-21T07:00:00.000Z',
          content: '**komentar telah dihapus**',
          likeCount: 1,
          replies: [
            {
              id: 'reply-2',
              content: '**balasan telah dihapus**',
              date: '2025-11-22T07:10:00.000Z',
              username: 'userD',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThreadExist = jest.fn()
      .mockResolvedValue();
    mockThreadRepository.getDetailThread = jest.fn()
      .mockResolvedValue(mockDataFromRepository);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    const result = await getThreadDetailUseCase.execute('thread-123');

    expect(mockThreadRepository.checkThreadExist).toBeCalledWith('thread-123');
    expect(mockThreadRepository.getDetailThread).toBeCalledWith('thread-123');
    expect(result).toStrictEqual(expectedMappedThread);
  });
});
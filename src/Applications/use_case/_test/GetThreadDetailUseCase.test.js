const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    const mockThreadDetail = {
      id: 'thread-123',
      title: 'title thread',
      body: 'body thread',
      date: '2025-11-19T07:00:00.000Z',
      username: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(mockThreadDetail.id);

    expect(threadDetail).toStrictEqual(mockThreadDetail);
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(mockThreadDetail.id);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(mockThreadDetail.id);
  });
});
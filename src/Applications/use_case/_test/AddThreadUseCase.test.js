const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const ThreadUser = require('../../../Domains/threads/entities/ThreadUser');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {

  it('should orchestrate the add thread action correctly', async () => {

    const useCasePayload = {
      title: 'title thread',
      body: 'body thread',
      owner: 'user-123',
    };

    const mockAddedThread = new ThreadUser({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread)
      .toBeCalledWith(new ThreadUser({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }));
    expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);

  });
});

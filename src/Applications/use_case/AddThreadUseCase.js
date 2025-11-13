const ThreadUser = require('../../Domains/threads/entities/ThreadUser');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const threadUser = new ThreadUser(useCasePayload);
    return this._threadRepository.addThread(threadUser);
  }
}

module.exports = AddThreadUseCase;

class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkThreadExist(threadId);
    return this._threadRepository.getDetailThread(threadId);
  }
}

module.exports = GetThreadDetailUseCase;

class ThreadUser {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { title, body, owner } = payload;

    if (!title || !body || !owner) {
      throw new Error('THREAD_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('THREAD_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadUser;
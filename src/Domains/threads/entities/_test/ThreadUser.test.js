const ThreadUser = require('../ThreadUser');

describe('a ThreadUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {

    const payload = {
      title: 'abc'
    };

    expect(() => new ThreadUser(payload)).toThrowError('THREAD_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      title: 123,
      body: true,
      owner: "user-123"
    };

    expect(() => new ThreadUser(payload)).toThrowError('THREAD_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

});

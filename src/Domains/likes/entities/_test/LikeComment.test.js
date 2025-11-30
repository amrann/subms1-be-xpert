const LikeComment = require('../LikeComment');

describe('a ReplyUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: "owner-123"
    };

    expect(() => new LikeComment(payload)).toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {

    const payload = {
      owner: "owner-123",
      threadId: "thread-eqw3",
      commentId: 12345,
    };

    expect(() => new LikeComment(payload)).toThrowError('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});

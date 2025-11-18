/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('t_comments', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('t_comments', 'is_delete');
};

exports.tags = ['comments-is-delete'];
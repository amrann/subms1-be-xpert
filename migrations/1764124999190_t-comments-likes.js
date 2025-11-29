/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('t_comments_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 't_threads(id)',
      onDelete: 'CASCADE'
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 't_comments(id)',
      onDelete: 'CASCADE',
    },
    timestamp: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
  });

  // User hanya bisa like satu kali per comment
  pgm.addConstraint('t_comments_likes', 'unique_comment_user', {
    unique: ['comment_id', 'owner'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('t_comments_likes');
};

exports.tags = ['comments-likes-table'];

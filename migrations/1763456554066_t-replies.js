/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('t_replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    timestamp: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
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
      onDelete: 'CASCADE'
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('t_replies');
};

exports.tags = ['replies-table'];



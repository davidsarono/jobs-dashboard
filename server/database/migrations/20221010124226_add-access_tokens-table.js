/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('access_tokens', function (table) {
        table.increments();
        table.integer('user_id');
        table.string('token');
        table.dateTime('created_at').nullable().defaultTo(knex.fn.now());
        table.dateTime('updated_at').nullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('access_tokens');
};

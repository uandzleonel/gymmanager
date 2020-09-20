const db = require('../../config/db');

module.exports = {
  all(callback) {
    const query = `
      SELECT * FROM members ORDER BY name ASC
    `;

    db.query(query, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows);
    })
  },

  create(data, callback) {
    const query = `
      INSERT INTO members(
        name,
        avatar_url,
        gender,
        email,
        birth,
        blood,
        weight,
        height,
        instructor_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.email,
      new Date(data.birth).toISOString(),
      data.blood,
      data.weight,
      data.height,
      data.instructor_id,
      new Date().toISOString()
    ]

    db.query(query, values, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows[0])
    })
  },

  find(id, callback){
    const query = `
      SELECT
        members.id,
        members.name,
        members.avatar_url,
        members.gender,
        members.email,
        members.birth,
        members.blood,
        members.weight,
        members.height,
        members.instructor_id,
        instructors.name AS instructor_name,
        members.created_at
      FROM
        members
      LEFT JOIN instructors
        ON instructors.id = members.instructor_id
      WHERE
        members.id = $1
    `;

    db.query(query, [id], (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows[0]);
    })
  },

  update(data, callback){
    const query = `
      UPDATE members SET
        name = ($1),
        avatar_url = ($2),
        gender = ($3),
        email = ($4),
        birth = ($5),
        blood = ($6),
        weight = ($7),
        height = ($8),
        instructor_id = ($9)
      WHERE id = ($10)
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.email,
      new Date(data.birth).toISOString(),
      data.blood,
      data.weight,
      data.height,
      data.instructor_id,
      data.id
    ]

    db.query(query, values, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback()
    })
  },

  delete(id, callback){
    const query = `
      DELETE FROM members
      WHERE id = $1
    `;

    db.query(query, [id], (error, results) => {
      if(error) throw `Database error! ${error}`
      callback()
    })
  },

  instructorsSelectOptions(callback){
    const query = `
      SELECT
        id,
        name
      FROM
        instructors
    `;

    db.query(query, (error, results) => {
      if(error) throw 'Database error!';
      callback(results.rows);
    })
  },

  paginate(params, callback){
    const { filter, limit, offset } = params;

    let filterQuery = '';
    let totalQuery = ''

    totalQuery = `
      (SELECT COUNT(1) FROM members) as total
    `;

    if( filter ) {
      filterQuery = `
        WHERE
          members.name ILIKE '%${filter}%'
          OR members.email ILIKE '%${filter}%'
      `;

      totalQuery = `
        (SELECT COUNT(1) FROM members ${filterQuery}) as total
      `;
    }

    const query = `
      SELECT
        members.*,
        ${totalQuery}
      FROM
        members
      ${filterQuery}
      ORDER BY
        members.name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    db.query(query, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows);
    })
  }
}

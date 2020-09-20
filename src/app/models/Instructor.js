const db = require('../../config/db');

module.exports = {
  all(callback) {
    const query = `
      SELECT
        instructors.*,
        COUNT(members.id) AS total_students
      FROM
        instructors
      LEFT JOIN members
        ON members.instructor_id = instructors.id
      GROUP BY
        instructors.id
      ORDER BY
        total_students DESC,
        instructors.name ASC
    `;

    db.query(query, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows);
    })
  },

  create(data, callback) {
    const query = `
      INSERT INTO instructors(
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.services,
      new Date(data.birth).toISOString(),
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
        instructors.*,
        COUNT(members.id) AS total_students
      FROM
        instructors
      LEFT JOIN members
        ON members.instructor_id = instructors.id
      WHERE
        instructors.id = $1
      GROUP BY
        instructors.id
      ORDER BY
        total_students DESC,
        instructors.name ASC
    `;

    db.query(query, [id], (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows[0]);
    })
  },

  findBy(filter, callback){
    const query = `
      SELECT
        instructors.*,
        COUNT(members.id) AS total_students
      FROM
        instructors
      LEFT JOIN members
        ON members.instructor_id = instructors.id
      WHERE
        instructors.name ILIKE '%${filter}%'
        OR instructors.services ILIKE '%${filter}%'
      GROUP BY
        instructors.id
      ORDER BY
        total_students DESC,
        instructors.name ASC
    `;

    db.query(query, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows);
    })
  },

  update(data, callback){
    const query = `
      UPDATE instructors SET
        name = ($1),
        avatar_url = ($2),
        gender = ($3),
        services = ($4),
        birth = ($5)
      WHERE id = ($6)
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.gender,
      data.services,
      new Date(data.birth).toISOString(),
      data.id
    ]

    db.query(query, values, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback()
    })
  },

  delete(id, callback){
    const query = `
      DELETE FROM instructors
      WHERE id = $1
    `;

    db.query(query, [id], (error, results) => {
      if(error) throw `Database error! ${error}`
      callback()
    })
  },

  paginate(params, callback){
    const { filter, limit, offset } = params;

    let filterQuery = '';
    let totalQuery = ''

    totalQuery = `
      (SELECT COUNT(1) FROM instructors) as total
    `;

    if( filter ) {
      filterQuery = `
        WHERE
          instructors.name ILIKE '%${filter}%'
          OR instructors.services ILIKE '%${filter}%'
      `;

      totalQuery = `
        (SELECT COUNT(1) FROM instructors ${filterQuery}) as total
      `;
    }

    const query = `
      SELECT
        instructors.*,
        COUNT(members.id) AS total_students,
        ${totalQuery}
      FROM
        instructors
      LEFT JOIN members
        ON members.instructor_id = instructors.id
      ${filterQuery}
      GROUP BY
        instructors.id
      ORDER BY
        total_students DESC,
        instructors.name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    db.query(query, (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows);
    })
  }
}

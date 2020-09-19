const db = require('../../config/db');

module.exports = {
  all(callback) {
    const query = `
      SELECT
        id,
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      FROM instructors
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
        id,
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      FROM instructors
      WHERE id = $1
    `;

    db.query(query, [id], (error, results) => {
      if(error) throw `Database error! ${error}`
      callback(results.rows[0]);
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
  }
}
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
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
        email,
        birth,
        blood,
        weight,
        height,
        created_at
      FROM members
      WHERE id = $1
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
        height = ($8)
      WHERE id = ($9)
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
  }
}

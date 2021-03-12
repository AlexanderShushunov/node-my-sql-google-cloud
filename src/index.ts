import mysql, { Pool } from 'mysql'

let pool: Pool

function getPool () {
  pool = pool || mysql.createPool({
    connectionLimit: 2,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  })
  return pool
}

async function cleanUp () {
  if (!pool) {
    return
  }
  return new Promise((resolve, reject) => {
    pool.end((err) => {
      if (err) {
        reject(err)
        return
      }
      resolve(undefined)
    })
  })
}

async function getSegment (id: string) {
  if (!id) {
    return 'fly-by'
  }

  return new Promise((resolve, reject) => {
    getPool().query(
      'SELECT * FROM users where id = ?',
      id,
      function (err, results) {
        if (err) {
          reject(err)
          return
        }
        if (results.length === 0) {
          reject(`No Score found for ID: ${id}`)
          return
        }
        resolve(results[0].SCORE)
      })
  })
}

async function toDo () {
  const segments = await Promise.all([
    getSegment('1fe0ccaf6d39407583bf9c06156be30f'),
    getSegment('7ac9838a2f7444dabf59f9166c8e6d62'),
    getSegment('ec4b77adcf1c471db966055921078e34'),
    getSegment('1fb5940d9dba4ef0a8ea68a3b02a1f07'),
    getSegment('f363fa019f994935a960c7b282612c12'),
    getSegment('479bf1eac209482e8ed2f55894c3f8d3'),
    getSegment('02f8dad802d0487eb2e1a38428eb0a1f'),
    getSegment('ac3e9042766e4dd298f251eb2c607bdd')
  ])
  console.log(segments)
  await cleanUp()
}

toDo()
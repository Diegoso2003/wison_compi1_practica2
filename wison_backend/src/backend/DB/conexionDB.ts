import mysql from "mysql2/promise"

export const conexionDB = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Programacion",
    database: "Wison",
    waitForConnections: true,
    connectionLimit: 10
})
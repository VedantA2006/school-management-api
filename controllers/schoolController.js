const pool = require('../config/db');

// Add a new school
const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [name, address, latitude, longitude]);

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude
      }
    });
  } catch (error) {
    next(error);
  }
};

// List schools sorted by distance
const listSchools = async (req, res, next) => {
  try {
    const { lat, lon } = req.parsedQuery;

    // Haversine formula directly in SQL
    // 6371 is the radius of the Earth in km. Use 3959 for miles.
    const query = `
      SELECT id, name, address, latitude, longitude,
      (
        6371 * acos (
          cos ( radians(?) )
          * cos( radians( latitude ) )
          * cos( radians( longitude ) - radians(?) )
          + sin ( radians(?) )
          * sin( radians( latitude ) )
        )
      ) AS distance
      FROM schools
      ORDER BY distance ASC
    `;

    const [rows] = await pool.execute(query, [lat, lon, lat]);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSchool,
  listSchools
};

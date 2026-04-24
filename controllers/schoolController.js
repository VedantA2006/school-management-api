const db = require('../config/db');

// -------------------- ADD SCHOOL --------------------
const addSchool = (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const query = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [name, address, latitude, longitude], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: "School added successfully",
        data: {
          id: result.insertId,
          name,
          address,
          latitude,
          longitude
        }
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// -------------------- LIST SCHOOLS --------------------
const listSchools = (req, res) => {
  try {
    // ✅ FIX: use req.query (NOT parsedQuery)
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required"
      });
    }

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

    db.query(query, [latitude, longitude, latitude], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        count: rows.length,
        data: rows
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const validateAddSchool = (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'All fields (name, address, latitude, longitude) are required.' });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name must be a non-empty string.' });
  }

  if (typeof address !== 'string' || address.trim() === '') {
    return res.status(400).json({ error: 'Address must be a non-empty string.' });
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Latitude and longitude must be numbers.' });
  }

  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90.' });
  }

  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Longitude must be between -180 and 180.' });
  }

  next();
};

const validateListSchools = (req, res, next) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required query parameters.' });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: 'Latitude and longitude must be valid numbers.' });
  }

  if (lat < -90 || lat > 90) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90.' });
  }

  if (lon < -180 || lon > 180) {
    return res.status(400).json({ error: 'Longitude must be between -180 and 180.' });
  }

  // Attach parsed floats to req for the controller to use
  req.parsedQuery = { lat, lon };
  next();
};

module.exports = {
  validateAddSchool,
  validateListSchools
};

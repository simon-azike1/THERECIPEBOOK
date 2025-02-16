import jwt from 'jsonwebtoken';

export const verify = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(404).json({ success: false, message: 'Authorization header not found!' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(404).json({ success: false, message: 'Token not found!' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ auth: false, message: 'Unauthorized' });
      }
      
      req.user = decodedToken; 
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};


const jwt = require('jsonwebtoken');

const isauth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      // Sirf ek hi response bhejna hai
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please sign in." 
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decoded || !decoded.user) {
      // Sirf ek hi response bhejna hai
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token. Please sign in again." 
      });
    }

    req.userid = decoded.user;
    next(); // Agla middleware ko proceed karo

  } catch (error) {
    console.error("Auth middleware error:", error);
    
    // Sirf ek hi response bhejna hai
    return res.status(401).json({ 
      success: false, 
      message: "Authentication failed. Please sign in again." 
    });
  }
};

module.exports = isauth;
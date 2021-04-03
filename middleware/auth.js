import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
   const unauthorized = () => { return res.status(401).json({ message: "Unauthorized" }) };
   try {
      const token = req.cookies.token;

      if(!token) return unauthorized();

      const verified = jwt.verify(token, process.env.JWT_SECRET);

      req.user = verified.user;

      next();
   } catch (err) {
      console.error(err);
      return unauthorized();
   }
}

export default auth;
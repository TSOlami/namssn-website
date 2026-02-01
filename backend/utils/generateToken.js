import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;

import jwt from 'jsonwebtoken';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function secret() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
  return process.env.JWT_SECRET;
}

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, secret(), { expiresIn: '30d' });
}

// Reads the optional login token and the anonymous guest id from every request.
// Sets req.user (or null) and req.guestId (or null). Never rejects.
export function identify(req, _res, next) {
  req.user = null;
  const header = req.get('authorization') || '';
  if (header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.slice(7), secret());
    } catch {
      req.user = null;
    }
  }
  const guestId = req.get('x-guest-id');
  req.guestId = guestId && UUID_RE.test(guestId) ? guestId : null;
  next();
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please log in to continue' });
  next();
}

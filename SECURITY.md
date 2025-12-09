# Security Best Practices

## Development vs Production

### This Repository Contains Development Defaults

This repository includes default credentials and example configurations that are **ONLY for development and testing**. These are intentionally weak to make local development easy but should **NEVER** be used in production.

## Development Credentials

The following files contain development-only credentials:

1. **`backend/.env`** - Contains seed script credentials
2. **`backend/seed.js`** - Creates a default admin user (credentials from .env)

### Default Seed Credentials
```
Email: admin@example.com
Password: DevOnly123!
```

**These credentials are publicly visible and should never be used in production.**

## Before Deploying to Production

### 1. Change All Default Credentials

Never use the seed script in production. Instead:

- Create your admin user manually through the registration interface
- Use strong, unique passwords (minimum 12 characters, mix of letters, numbers, symbols)
- Consider implementing a separate admin onboarding process

### 2. Secure Environment Variables

Update your `.env` file with production values:

```bash
# Use a cryptographically secure random string
JWT_SECRET=<generate-a-secure-random-string-at-least-64-characters>

# Use a production MongoDB instance with authentication
MONGODB_URI=mongodb://username:password@production-host:27017/dbname

# Set to production
NODE_ENV=production

# Remove or change seed credentials
# Better yet: Don't include these variables in production
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Never Commit .env Files

The `.gitignore` file excludes `.env` files, but always double-check:

```bash
# Verify .env is not tracked
git status

# If it appears, remove it immediately
git rm --cached backend/.env
git commit -m "Remove .env from tracking"
```

### 4. MongoDB Security

For production:

- Enable authentication on MongoDB
- Use strong passwords for database users
- Limit database user permissions (principle of least privilege)
- Use MongoDB Atlas or another managed service with built-in security
- Enable SSL/TLS for database connections
- Restrict network access with firewalls/IP whitelisting

### 5. Additional Security Measures

- **Rate Limiting**: Add rate limiting to prevent brute force attacks
- **HTTPS Only**: Use HTTPS in production (never HTTP)
- **CORS**: Configure CORS to only allow your frontend domain
- **Helmet.js**: Add helmet middleware for security headers
- **Input Validation**: Already implemented with express-validator, but review all endpoints
- **Dependency Updates**: Regularly update dependencies to patch vulnerabilities
- **Audit Logs**: Consider adding audit logging for sensitive operations

### 6. Recommended Production Setup

```javascript
// Add to backend/server.js for production
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

if (process.env.NODE_ENV === 'production') {
  // Security headers
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);

  // Stricter CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
}
```

## Reporting Security Issues

If you discover a security vulnerability in this codebase, please report it responsibly:

1. **Do not** create a public GitHub issue
2. Email the maintainer directly with details
3. Allow time for the issue to be addressed before public disclosure

## GitGuardian and Secret Scanning

This repository may trigger secret scanning alerts for:

- Default seed credentials in `backend/seed.js`
- Example credentials in README.md
- Environment variable examples in `.env.example`

These are intentional for development purposes and are clearly marked as such. The actual `.env` file is gitignored and should never be committed.

## Security Checklist for Production

- [ ] Changed all default passwords
- [ ] Generated new JWT_SECRET (64+ random characters)
- [ ] Configured production MongoDB with authentication
- [ ] Enabled HTTPS
- [ ] Configured CORS for production domain only
- [ ] Added rate limiting
- [ ] Added helmet.js security headers
- [ ] Removed/disabled seed script access
- [ ] Set NODE_ENV=production
- [ ] Reviewed and restricted user permissions
- [ ] Set up monitoring and logging
- [ ] Configured automated backups
- [ ] Scanned dependencies for vulnerabilities (`npm audit`)

## License

This security document is part of the AV Documentation Platform project.

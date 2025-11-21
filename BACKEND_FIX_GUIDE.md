# Backend Player File URL Storage Fix

## Problem
Frontend sends player files correctly, but backend doesn't save Cloudinary URLs to database.

## Root Cause
Backend uploads files to Cloudinary but never appends the returned URLs to the database INSERT statement.

## Solution

In your backend registration endpoint, after uploading files to Cloudinary, add the URLs to the player record:

```python
# After successful upload to Cloudinary, save URLs like this:
aadhar_url = cloudinary.uploader.upload(aadhar_file)['secure_url']
subscription_url = cloudinary.uploader.upload(subscription_file)['secure_url']

# Then include in INSERT:
INSERT INTO players (player_id, name, aadhar_file, subscription_file)
VALUES (player_id, name, aadhar_url, subscription_url)
```

## Verification
- Check database: `SELECT aadhar_file, subscription_file FROM players LIMIT 1`
- Should return full Cloudinary URLs, not NULL
- Admin dashboard will then display all files correctly

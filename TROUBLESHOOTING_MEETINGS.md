# Troubleshooting: Meetings Not Displaying

## Quick Checks

### 1. Verify Meeting Was Created
- Log in as admin
- Go to Admin Dashboard → Live Classes
- Create a meeting with a future date/time
- Check browser console for any errors
- Verify the meeting appears in the response

### 2. Check API Endpoint
Open browser console and run:
```javascript
fetch('/api/meetings/student', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### 3. Verify Student Dashboard
- Log in as student
- Open browser console (F12)
- Check for:
  - API call to `/api/meetings/student`
  - Any errors in console
  - Network tab shows 200 response

### 4. Check Date/Time Format
Meetings must have:
- `scheduledDate`: Date object or ISO string
- `scheduledTime`: String in "HH:MM" format (e.g., "14:30")
- `duration`: Number (minutes)

### 5. Common Issues

**Issue: No meetings showing**
- Check if meetings exist in database
- Verify meeting status is 'scheduled' or 'ongoing'
- Ensure meeting date is in the future

**Issue: API returns empty array**
- Check server logs for errors
- Verify authentication token is valid
- Check MongoDB connection

**Issue: Meetings show but can't join**
- Verify Jitsi Meet script loads
- Check browser console for Jitsi errors
- Ensure meeting URL is correct format

## Debug Steps

1. **Check Server Logs**
   - Look for "Found X upcoming meetings for student" message
   - Check for any error messages

2. **Check Browser Console**
   - Look for "Fetched meetings:" log
   - Check for any JavaScript errors
   - Verify API response structure

3. **Test API Directly**
   ```bash
   curl -X GET http://localhost:5000/api/meetings/student \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Verify Database**
   - Connect to MongoDB
   - Check `meetings` collection
   - Verify meeting documents exist and have correct structure

## Expected Behavior

1. Admin creates meeting → Meeting saved to database
2. Student loads dashboard → API call to `/api/meetings/student`
3. API returns meetings → Filtered to show only upcoming/live
4. Dashboard displays meetings → Shows in "Upcoming Live Classes" section
5. Student clicks Join → Redirects to Jitsi Meet interface

## Still Not Working?

1. Restart server
2. Clear browser cache
3. Check MongoDB connection
4. Verify all dependencies installed
5. Check server/index.js has meeting routes registered


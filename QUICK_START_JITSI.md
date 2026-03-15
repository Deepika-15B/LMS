# Quick Start Guide - Jitsi Meet Integration

## Quick Setup (5 minutes)

### 1. Start Your Server
```bash
npm start
# or
npm run dev
```

### 2. No Additional Dependencies Needed!
The integration uses Jitsi Meet's cloud service, so no extra npm packages are required.

### 3. Test the Integration

#### As Instructor (Admin):
1. Log in with an admin account
2. Go to Admin Dashboard
3. Click "Live Classes" card
4. Fill in the form:
   - Title: "Test Meeting"
   - Course Name: "Test Course"
   - Date: Tomorrow's date
   - Time: Any time
   - Duration: 60 minutes
5. Click "Create Meeting"
6. Note the meeting room ID that was generated

#### As Student:
1. Log in with a student account
2. Make sure the student is enrolled in a course (if you linked a course)
3. Go to Student Dashboard
4. Click "Live Classes" in Quick Actions
5. You should see the meeting you created
6. Click "Join Meeting"
7. Allow camera/microphone permissions
8. You're in the meeting!

## Key Files Created

### Backend:
- `server/models/Meeting.js` - Database model
- `server/routes/meetings.js` - API endpoints

### Frontend:
- `client/src/pages/CreateMeeting.js` - Create meeting form
- `client/src/pages/LiveClasses.js` - List of meetings
- `client/src/pages/JitsiMeeting.js` - Embedded Jitsi interface

### Documentation:
- `JITSI_INTEGRATION_SETUP.md` - Full setup guide
- `QUICK_START_JITSI.md` - This file

## Routes Added

- `/admin/meetings/create` - Create meeting (Admin only)
- `/admin/meetings` - View all meetings (Admin only)
- `/student/live-classes` - View upcoming meetings (Students)
- `/meeting/:roomId` - Join a meeting

## Common Issues

### "Failed to load Jitsi Meet"
- Check your internet connection
- The Jitsi Meet script loads from CDN
- Try refreshing the page

### "No meetings available"
- Make sure you created a meeting as admin
- Check if student is enrolled in the course
- Verify meeting date is in the future

### "Access denied"
- Only enrolled students can see meetings
- Only admins can create meetings
- Check user roles in database

## Next Steps

1. Read the full documentation: `JITSI_INTEGRATION_SETUP.md`
2. Customize the Jitsi interface in `JitsiMeeting.js`
3. Add meeting reminders/notifications
4. Consider setting up your own Jitsi server for production

## Support

- Jitsi Meet Docs: https://jitsi.github.io/handbook/
- Check browser console for errors
- Verify MongoDB connection
- Check server logs for API errors


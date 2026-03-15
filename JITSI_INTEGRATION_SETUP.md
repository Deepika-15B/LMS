# Jitsi Meet Integration Setup Guide

This guide will help you set up and configure the Jitsi Meet live online class feature in your LMS.

## Overview

The Jitsi Meet integration allows instructors to schedule and conduct live online classes, and students to join those classes directly from the LMS dashboard. The system uses Jitsi Meet's External API to embed video conferencing functionality.

## Features

- **Instructor Features:**
  - Create and schedule live meetings
  - Set meeting title, course name, date, time, and duration
  - Generate unique meeting room links automatically
  - Manage meetings (view, update, delete)

- **Student Features:**
  - View upcoming live classes for enrolled courses
  - Join meetings with one click
  - Embedded Jitsi Meet interface
  - Real-time video/audio communication

## Prerequisites

1. Node.js and npm installed
2. MongoDB database running
3. Existing LMS application with authentication system
4. Internet connection (for Jitsi Meet cloud service)

## Installation Steps

### 1. Backend Setup

The backend components are already created. No additional npm packages are required as the integration uses Jitsi Meet's cloud service via their External API.

#### Database Model

The `Meeting` model has been created at `server/models/Meeting.js` with the following fields:
- `title`: Meeting title
- `courseName`: Course name
- `course`: Reference to Quiz model (optional)
- `description`: Meeting description
- `scheduledDate`: Date of the meeting
- `scheduledTime`: Time of the meeting (HH:MM format)
- `duration`: Duration in minutes (15-480)
- `meetingRoomId`: Unique room identifier
- `meetingUrl`: Full Jitsi Meet URL
- `instructor`: Reference to User model
- `status`: Meeting status (scheduled, ongoing, completed, cancelled)
- `enrolledStudents`: Array of enrolled students

#### API Routes

The meeting routes are available at `/api/meetings` with the following endpoints:

- `POST /api/meetings` - Create a meeting (Admin only)
- `GET /api/meetings/student` - Get meetings for students
- `GET /api/meetings/instructor` - Get meetings for instructors (Admin only)
- `GET /api/meetings/:id` - Get a specific meeting
- `PUT /api/meetings/:id` - Update a meeting (Admin only)
- `DELETE /api/meetings/:id` - Delete a meeting (Admin only)
- `POST /api/meetings/:id/join` - Join a meeting

#### Environment Variables

Add the following optional environment variable to your `.env` file:

```env
# Jitsi Meet Configuration (Optional)
JITSI_BASE_URL=https://meet.jit.si
```

By default, the system uses `https://meet.jit.si` (Jitsi Meet's public cloud service).

### 2. Frontend Setup

The frontend components have been created. The Jitsi Meet External API script is loaded dynamically when needed.

#### Components Created

1. **CreateMeeting.js** - Form for instructors to create meetings
   - Location: `client/src/pages/CreateMeeting.js`
   - Route: `/admin/meetings/create`

2. **LiveClasses.js** - List of upcoming meetings for students
   - Location: `client/src/pages/LiveClasses.js`
   - Route: `/student/live-classes`

3. **JitsiMeeting.js** - Embedded Jitsi Meet interface
   - Location: `client/src/pages/JitsiMeeting.js`
   - Route: `/meeting/:roomId`

#### Routes Added

The following routes have been added to `client/src/App.js`:

```javascript
<Route 
  path="/admin/meetings/create" 
  element={user?.role === 'admin' ? <CreateMeeting /> : <Navigate to="/" />} 
/>
<Route 
  path="/admin/meetings" 
  element={user?.role === 'admin' ? <LiveClasses /> : <Navigate to="/" />} 
/>
<Route 
  path="/student/live-classes" 
  element={user ? <LiveClasses /> : <Navigate to="/login" />} 
/>
<Route 
  path="/meeting/:roomId" 
  element={user ? <JitsiMeeting /> : <Navigate to="/login" />} 
/>
```

### 3. Dependencies

No additional npm packages are required. The integration uses:
- Existing React dependencies
- Jitsi Meet External API (loaded dynamically from CDN)
- `moment` (already installed for date formatting)

### 4. Database Migration

The Meeting model will be automatically created when you start the server. No manual migration is needed.

## Usage Guide

### For Instructors (Admin Role)

1. **Creating a Meeting:**
   - Navigate to Admin Dashboard
   - Click on "Live Classes" card
   - Fill in the meeting form:
     - Meeting Title (required)
     - Course Name (required)
     - Optional: Select an existing course from dropdown
     - Date and Time (required)
     - Duration in minutes (15-480, required)
     - Description (optional)
   - Click "Create Meeting"
   - A unique meeting room link will be generated automatically

2. **Viewing Meetings:**
   - Navigate to `/admin/meetings` to see all your scheduled meetings
   - You can see meeting details, enrolled students, and status

3. **Managing Meetings:**
   - Update or delete meetings you created
   - Only the instructor who created a meeting can modify it

### For Students

1. **Viewing Live Classes:**
   - Navigate to Student Dashboard
   - Click on "Live Classes" in Quick Actions
   - Or go directly to `/student/live-classes`
   - You'll see all upcoming meetings for courses you're enrolled in

2. **Joining a Meeting:**
   - Click "Join Meeting" or "Join Live Class" button
   - The Jitsi Meet interface will open
   - Allow camera/microphone permissions when prompted
   - You'll be connected to the meeting room

3. **During the Meeting:**
   - Use the toolbar to mute/unmute audio/video
   - Share your screen if needed
   - Use chat to communicate
   - Click "Leave Meeting" to exit

## Meeting Room ID Generation

Meeting room IDs are automatically generated using the format:
```
{courseName-sanitized}-{timestamp}
```

For example:
- Course: "React Development"
- Room ID: "react-development-1703123456789"

This ensures unique room names for each meeting.

## Security & Access Control

1. **Instructor Permissions:**
   - Only users with `role: 'admin'` can create meetings
   - Instructors can only modify/delete their own meetings

2. **Student Access:**
   - Students can only see meetings for courses they're enrolled in
   - Access is checked when joining a meeting
   - Students are automatically added to the enrolled list when joining

3. **Meeting URLs:**
   - Meeting URLs are unique and generated server-side
   - Room IDs are based on course name and timestamp
   - No password protection by default (can be added via Jitsi config)

## Customization

### Using Your Own Jitsi Server

If you want to use your own Jitsi Meet server instead of the public cloud:

1. Set the `JITSI_BASE_URL` environment variable:
   ```env
   JITSI_BASE_URL=https://your-jitsi-server.com
   ```

2. Update the domain in `JitsiMeeting.js`:
   ```javascript
   const domain = 'your-jitsi-server.com';
   ```

### Customizing Jitsi Interface

You can customize the Jitsi Meet interface by modifying the `configOverwrite` and `interfaceConfigOverwrite` options in `JitsiMeeting.js`.

### Adding Meeting Passwords

To add password protection to meetings:

1. Add a `password` field to the Meeting model
2. Generate a password when creating a meeting
3. Pass it to Jitsi config:
   ```javascript
   configOverwrite: {
     roomPassword: meeting.password
   }
   ```

## Troubleshooting

### Meeting Not Loading

1. **Check Internet Connection:**
   - Jitsi Meet requires an active internet connection
   - Ensure the Jitsi Meet External API script loads

2. **Browser Permissions:**
   - Allow camera and microphone permissions
   - Check browser console for errors

3. **CORS Issues:**
   - Ensure your server allows requests from your frontend domain
   - Check CORS configuration in `server/index.js`

### Students Can't See Meetings

1. **Check Enrollment:**
   - Students must be enrolled in the course
   - Verify `enrolledCourses` array in User model

2. **Check Meeting Status:**
   - Only "scheduled" and "ongoing" meetings are shown
   - Past meetings are filtered out

### Meeting Room Already Exists

- Room IDs are generated with timestamps, so duplicates are extremely unlikely
- If it happens, the system will handle it via MongoDB's unique constraint

## API Examples

### Create a Meeting

```javascript
POST /api/meetings
Headers: { Authorization: 'Bearer <token>' }
Body: {
  "title": "Introduction to React",
  "courseName": "React Development",
  "courseId": "optional-course-id",
  "description": "Learn the basics of React",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "14:30",
  "duration": 60
}
```

### Get Student Meetings

```javascript
GET /api/meetings/student
Headers: { Authorization: 'Bearer <token>' }
```

### Join a Meeting

```javascript
POST /api/meetings/:id/join
Headers: { Authorization: 'Bearer <token>' }
```

## Testing

1. **Create a Test Meeting:**
   - Log in as admin
   - Create a meeting scheduled for a few minutes in the future
   - Note the meeting room ID

2. **Join as Student:**
   - Log in as a student enrolled in the course
   - Navigate to Live Classes
   - Click "Join Meeting"
   - Verify video/audio works

3. **Test Multiple Users:**
   - Open multiple browser windows
   - Join the same meeting from different accounts
   - Verify all participants can see each other

## Performance Considerations

1. **Meeting Duration:**
   - Maximum duration is set to 480 minutes (8 hours)
   - Consider server resources for longer meetings

2. **Concurrent Meetings:**
   - Jitsi Meet cloud service handles multiple concurrent meetings
   - For high traffic, consider your own Jitsi server

3. **Database Indexing:**
   - Indexes are created on `scheduledDate`, `instructor`, `course`, and `status`
   - This ensures fast queries for meeting lists

## Future Enhancements

Potential improvements you could add:

1. **Meeting Recordings:**
   - Integrate Jitsi Meet recording feature
   - Store recordings in your system

2. **Meeting Reminders:**
   - Email notifications before meetings
   - Calendar integration

3. **Attendance Tracking:**
   - Track who joined and for how long
   - Generate attendance reports

4. **Breakout Rooms:**
   - Use Jitsi's breakout room feature
   - Assign students to groups

5. **Screen Sharing Controls:**
   - Restrict screen sharing to instructor only
   - Control participant permissions

## Support

For issues related to:
- **Jitsi Meet:** Check [Jitsi Meet documentation](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)
- **LMS Integration:** Check this documentation and code comments
- **Database Issues:** Check MongoDB connection and schema

## License

This integration uses Jitsi Meet, which is open source. Ensure compliance with Jitsi's license terms when using their service.


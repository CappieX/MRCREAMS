# 🧪 VISUAL TEST GUIDE - Support Dashboard

## 🎯 Quick Visual Testing Checklist

This guide helps you visually verify that the Support Dashboard is working correctly.

---

## ✅ TEST 1: Database Setup (2 minutes)

### **Run Migration:**
```bash
cd /Users/Cappie/Documents/WCREAMS/backend
psql -U postgres -d wife_conflict_db -f migrations/008_create_support_tickets.sql
```

### **Expected Output:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE FUNCTION
CREATE TRIGGER
CREATE FUNCTION
CREATE TRIGGER
INSERT 0 8
INSERT 0 4
CREATE VIEW
COMMENT
COMMENT
COMMENT
COMMENT
COMMENT
```

### **Verify Tables:**
```sql
-- Connect to database
psql -U postgres -d wife_conflict_db

-- List tables
\dt support*
\dt ticket*

-- Should see:
-- support_tickets
-- support_agents
-- ticket_categories
-- ticket_activities
-- ticket_sla_configs
-- satisfaction_surveys
```

### **Check Default Data:**
```sql
-- View categories (should have 8)
SELECT name, color FROM ticket_categories;

-- View SLA configs (should have 4)
SELECT priority, first_response_minutes, resolution_minutes FROM ticket_sla_configs;
```

---

## ✅ TEST 2: Backend Server (1 minute)

### **Start Server:**
```bash
cd /Users/Cappie/Documents/WCREAMS/backend
npm start
```

### **Expected Console Output:**
```
Server running on port 5000
Database connected successfully
```

### **Test API Endpoint:**
```bash
# In a new terminal
curl http://localhost:5000/api/v1/support/categories

# Should return JSON with 8 categories
```

---

## ✅ TEST 3: Floating Ticket Button (Universal Widget)

### **What to Look For:**

1. **Login to Application**
   - Use any user account
   - Navigate to ANY page (dashboard, therapist, admin, etc.)

2. **Find the Floating Button**
   - Look at **bottom-right corner** of screen
   - Should see a **blue circular button** with support icon
   - Button should have hover effect (scales up slightly)

3. **Visual Check:**
   ```
   Screen Layout:
   ┌─────────────────────────────────────────┐
   │                                         │
   │         Your Page Content               │
   │                                         │
   │                                         │
   │                                         │
   │                                    ┌──┐ │
   │                                    │🎧│ │ ← Blue FAB
   │                                    └──┘ │
   └─────────────────────────────────────────┘
   ```

4. **Click the Button**
   - Dialog should open
   - Title: "Submit Support Ticket"
   - Form fields visible

---

## ✅ TEST 4: Ticket Submission Form

### **Visual Elements to Verify:**

```
┌─────────────────────────────────────────────┐
│ 🎧 Submit Support Ticket              [X]   │
├─────────────────────────────────────────────┤
│                                             │
│ [AI Suggestion Banner - Blue]               │ ← Should appear when typing
│ AI Suggestion: Category: Bug Report        │
│                                             │
│ Title: *                                    │
│ ┌─────────────────────────────────────┐    │
│ │ Brief description...                │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Description: *                              │
│ ┌─────────────────────────────────────┐    │
│ │ Detailed information...             │    │
│ │                                     │    │
│ │                                     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Priority:          Category:                │
│ ┌──────────────┐  ┌──────────────┐         │
│ │ 🟡 Medium   ▼│  │ Technical   ▼│         │
│ └──────────────┘  └──────────────┘         │
│                                             │
│ Ticket will be submitted as:                │
│ ┌─────────────────────────────────────┐    │
│ │ John Doe                            │    │
│ │ john@example.com                    │    │
│ └─────────────────────────────────────┘    │
│                                             │
│              [Cancel] [Submit Ticket]       │
└─────────────────────────────────────────────┘
```

### **Test Steps:**

1. **Type in Title:**
   - Enter: "Login error on mobile app"
   - AI suggestion should appear (blue banner)
   - Should suggest: Category = "Technical Issue" or "Bug Report"

2. **Type in Description:**
   - Enter: "This is urgent! The app crashes when I try to login"
   - AI should update priority suggestion to "High" or "Critical"

3. **Check Priority Dropdown:**
   - Click dropdown
   - Should see 4 options with colored dots:
     - 🟢 Low
     - 🟡 Medium
     - 🔴 High
     - 🔴 Critical

4. **Check Category Dropdown:**
   - Click dropdown
   - Should see 8 categories with colored dots
   - Each with different color

5. **Submit Ticket:**
   - Click "Submit Ticket"
   - Should see success message (green alert)
   - Dialog should close after 2 seconds

---

## ✅ TEST 5: Support Dashboard Access

### **Navigate to Dashboard:**
```
URL: http://localhost:3000/dashboard/support
```

### **Visual Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ [☰] Support Dashboard                                        │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│ Sidebar    │  📊 Quick Stats Cards                           │
│            │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│ 🏠 Dash    │  │ Open   │ │Unassign│ │Overdue │ │  CSAT  │  │
│ 🎫 Tickets │  │  24    │ │   8    │ │   3    │ │ 4.2/5  │  │
│ 👥 Customers│  └────────┘ └────────┘ └────────┘ └────────┘  │
│ 📊 Analytics│                                                 │
│            │  🎯 Filter Chips                                │
│            │  [All] [Mine] [Unassigned] [High Priority]     │
│            │                                                  │
│            │  📋 Ticket Queue Table                          │
│            │  ┌──────────────────────────────────────────┐  │
│            │  │ ID    │ Subject │ Status │ Priority     │  │
│            │  │ TKT-1 │ Login   │ Open   │ 🔴 High     │  │
│            │  │ TKT-2 │ API     │ Prog   │ 🟡 Medium   │  │
│            │  └──────────────────────────────────────────┘  │
│            │                                                  │
│            │  🔔 Recent Activity                             │
│            │  • Sarah assigned #TKT-045                      │
│            │  • John replied to #TKT-032                    │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

### **Visual Checks:**

1. **Sidebar (Left)**
   - ✅ Blue theme
   - ✅ 8 menu items
   - ✅ Badges showing counts
   - ✅ Active item highlighted

2. **Metric Cards (Top)**
   - ✅ 4 cards in a row
   - ✅ Icons and numbers visible
   - ✅ Different colors per card

3. **Filter Chips**
   - ✅ 4 chips visible
   - ✅ Clickable
   - ✅ Active chip highlighted (blue background)

4. **Ticket Table**
   - ✅ Headers visible
   - ✅ Rows with data
   - ✅ Color-coded status badges
   - ✅ Color-coded priority badges
   - ✅ Hover effect on rows

5. **Activity Feed**
   - ✅ List of recent activities
   - ✅ Ticket numbers as chips
   - ✅ Timestamps visible

---

## ✅ TEST 6: Click on a Ticket

### **Action:**
Click on any ticket row in the table

### **Expected Result:**
Navigate to ticket detail page

### **Visual Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ [☰] Ticket Details                                           │
├──────────────────────────────────────────────────────────────┤
│ #TKT-001: Login Issue │ [Open] [🔴 High] │ [Back to Tickets]│
├─────────────────────────────────────┬────────────────────────┤
│                                     │                        │
│ LEFT COLUMN (70%)                   │ RIGHT COLUMN (30%)     │
│                                     │                        │
│ 💬 Conversation Thread              │ 🎯 Ticket Details      │
│ ┌─────────────────────────────────┐ │ ┌──────────────────┐  │
│ │ 👤 John Doe (Customer)          │ │ │ Status:          │  │
│ │ I can't login to my account.    │ │ │ [Open ▼]         │  │
│ │ Error: 401                      │ │ │                  │  │
│ │ ⏰ 2 hours ago                  │ │ │ Priority:        │  │
│ │                                 │ │ │ [High ▼]         │  │
│ └─────────────────────────────────┘ │ │                  │  │
│                                     │ │ Assigned To:     │  │
│ ┌─────────────────────────────────┐ │ │ [Avatar] Sarah M.│  │
│ │ 👨‍💼 Sarah (Support Agent)        │ │ │                  │  │
│ │ Can you try resetting your      │ │ │ Requester:       │  │
│ │ password?                       │ │ │ [Avatar] John D. │  │
│ │ ⏰ 1 hour ago                   │ │ │                  │  │
│ └─────────────────────────────────┘ │ │ Category:        │  │
│                                     │ │ [Technical]      │  │
│ [Reply Box]                         │ │                  │  │
│ ┌─────────────────────────────────┐ │ │ 🕐 SLA: 4h left  │  │
│ │ Type your reply...              │ │ │ (Green box)      │  │
│ │                                 │ │ │                  │  │
│ └─────────────────────────────────┘ │ │ Created:         │  │
│ [📎] [Send]                         │ │ 2 hours ago      │  │
│                                     │ └──────────────────┘  │
└─────────────────────────────────────┴────────────────────────┘
```

### **Visual Checks:**

1. **Header**
   - ✅ Ticket number and title
   - ✅ Status badge (colored)
   - ✅ Priority badge (colored)
   - ✅ Back button

2. **Conversation Thread (Left)**
   - ✅ Original message at top
   - ✅ User avatar
   - ✅ Timestamp
   - ✅ Replies below (if any)
   - ✅ Reply box at bottom

3. **Details Panel (Right)**
   - ✅ Status dropdown (clickable)
   - ✅ Priority dropdown (clickable)
   - ✅ Assignee with avatar
   - ✅ Requester with avatar
   - ✅ Category chip (colored)
   - ✅ SLA timer (green or red)
   - ✅ Timestamps

4. **Interactions:**
   - ✅ Type in reply box
   - ✅ Click Send button
   - ✅ Change status dropdown
   - ✅ Change priority dropdown

---

## ✅ TEST 7: Add a Reply

### **Steps:**

1. **Type in Reply Box:**
   ```
   "Thank you for reporting this. I've reset your account. 
   Please try logging in again."
   ```

2. **Click Send Button**

3. **Expected Result:**
   - Reply appears in conversation thread
   - Shows your name and avatar
   - Shows "just now" timestamp
   - Reply box clears

### **Visual:**
```
┌─────────────────────────────────┐
│ 👨‍💼 You (Support Agent)        │
│ Thank you for reporting this.   │
│ I've reset your account.        │
│ Please try logging in again.    │
│ ⏰ just now                     │
└─────────────────────────────────┘
```

---

## ✅ TEST 8: Change Status

### **Steps:**

1. **Click Status Dropdown** (in right panel)
2. **Select "In Progress"**
3. **Expected Result:**
   - Status badge updates to orange
   - Activity logged in thread
   - Page refreshes with new status

### **Visual:**
```
Status badge changes:
[Open] → [In Progress]
Blue   → Orange
```

---

## ✅ TEST 9: All Tickets Page

### **Navigate:**
```
Click "All Tickets" in sidebar
OR
URL: http://localhost:3000/dashboard/support/tickets
```

### **Visual Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ All Support Tickets                    [Refresh] [Export]    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ 🔍 Filters                                                   │
│ ┌────────────────┐ ┌──────────┐ ┌──────────┐               │
│ │ Search...      │ │ Status ▼ │ │Priority▼ │               │
│ └────────────────┘ └──────────┘ └──────────┘               │
│                                                               │
│ 📋 Tickets Table                                             │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ [☑] │ ID    │ Subject │ Status │ Priority │ Assignee    ││
│ │ [ ] │ TKT-1 │ Login   │ Open   │ High     │ Sarah M.    ││
│ │ [ ] │ TKT-2 │ API     │ Prog   │ Medium   │ John D.     ││
│ │ [ ] │ TKT-3 │ Billing │ Open   │ Low      │ Unassigned  ││
│ └──────────────────────────────────────────────────────────┘│
│                                                               │
│ [< Previous] Page 1 of 3 [Next >]                           │
└──────────────────────────────────────────────────────────────┘
```

### **Visual Checks:**

1. **Search Bar**
   - ✅ Magnifying glass icon
   - ✅ Placeholder text
   - ✅ Can type in it

2. **Filter Dropdowns**
   - ✅ Status dropdown works
   - ✅ Priority dropdown works
   - ✅ Filters apply when selected

3. **Table**
   - ✅ Checkboxes in first column
   - ✅ All columns visible
   - ✅ Data populated
   - ✅ Badges colored correctly

4. **Pagination**
   - ✅ Page numbers visible
   - ✅ Previous/Next buttons
   - ✅ Buttons disabled when appropriate

---

## ✅ TEST 10: Bulk Operations

### **Steps:**

1. **Select Multiple Tickets**
   - Click checkboxes for 2-3 tickets
   - Bulk toolbar should appear at top

2. **Visual:**
   ```
   ┌──────────────────────────────────────────────────────┐
   │ 3 tickets selected                                   │
   │ [Change Status] [Assign To] [Change Priority] [Clear]│
   └──────────────────────────────────────────────────────┘
   ```

3. **Click "Change Status"**
   - Dialog opens
   - Dropdown with status options
   - "Apply to 3 Tickets" button

4. **Select New Status**
   - Choose "Resolved"
   - Click Apply

5. **Expected Result:**
   - Dialog closes
   - Tickets update
   - Selection clears
   - Table refreshes

---

## ✅ TEST 11: Mobile Responsiveness

### **Test on Mobile (or resize browser to < 768px)**

### **Visual Checks:**

1. **Floating Button**
   - ✅ Still visible bottom-right
   - ✅ Appropriate size for touch

2. **Sidebar**
   - ✅ Hidden by default
   - ✅ Opens as drawer when menu clicked
   - ✅ Closes when item selected

3. **Dashboard**
   - ✅ Metric cards stack vertically
   - ✅ Table scrolls horizontally
   - ✅ All content accessible

4. **Ticket Detail**
   - ✅ Single column layout
   - ✅ Details panel below conversation
   - ✅ All fields accessible

---

## ✅ TEST 12: AI Suggestions

### **Test AI Category Detection:**

| Type This | Expected Suggestion |
|-----------|-------------------|
| "Bug in login system" | Category: Bug Report, Priority: High |
| "Billing question about invoice" | Category: Billing, Priority: Medium |
| "Feature request for dark mode" | Category: Feature Request, Priority: Low |
| "URGENT: System is down!" | Category: Technical Issue, Priority: Critical |
| "Can't access my account" | Category: Account Management, Priority: High |
| "API integration not working" | Category: Integration, Priority: High |

### **Visual:**
```
┌─────────────────────────────────────────────┐
│ 🤖 AI Suggestion:                           │
│ Category: Bug Report • Priority: HIGH       │
│                              [Apply] [X]    │
└─────────────────────────────────────────────┘
```

---

## ✅ TEST 13: SLA Timer

### **Check SLA Display:**

1. **Open a ticket detail**
2. **Look at right panel**
3. **Find SLA section**

### **Visual Examples:**

**Time Remaining (Green):**
```
┌──────────────────┐
│ 🕐 SLA: 4h 23m  │
│ Until deadline   │
│ (Green box)      │
└──────────────────┘
```

**Overdue (Red):**
```
┌──────────────────┐
│ 🚨 OVERDUE       │
│ Past deadline    │
│ (Red box)        │
└──────────────────┘
```

---

## 🎯 QUICK VERIFICATION SUMMARY

### **✅ All Systems Working If:**

- [ ] Floating button visible on all pages
- [ ] Ticket submission form opens and works
- [ ] AI suggestions appear when typing
- [ ] Support dashboard loads with metrics
- [ ] Ticket list displays correctly
- [ ] Can click ticket to view details
- [ ] Can add comments/replies
- [ ] Status and priority dropdowns work
- [ ] Bulk selection and operations work
- [ ] Search and filters function
- [ ] SLA timer displays correctly
- [ ] Mobile view is responsive
- [ ] All colors and badges display correctly

---

## 🐛 COMMON VISUAL ISSUES & FIXES

### **Issue: Floating button not visible**
**Check:**
- User is logged in
- Browser console for errors
- Z-index conflicts with other elements

### **Issue: Dashboard shows "No tickets found"**
**Check:**
- Database has tickets (run: `SELECT COUNT(*) FROM support_tickets;`)
- API endpoint returns data
- User has correct permissions

### **Issue: AI suggestions not appearing**
**Check:**
- Typing enough text (>10 characters in title or >20 in description)
- Categories loaded from API
- No JavaScript errors in console

### **Issue: Colors not displaying correctly**
**Check:**
- `dashboardTheme` imported correctly
- Category colors in database (hex format)
- CSS not overriding styles

---

## 📸 SCREENSHOT CHECKLIST

### **Take Screenshots Of:**

1. ✅ Floating button on any page
2. ✅ Ticket submission form (empty)
3. ✅ Ticket submission form (with AI suggestion)
4. ✅ Support dashboard (full view)
5. ✅ Ticket detail page
6. ✅ All tickets list page
7. ✅ Bulk operations toolbar
8. ✅ Mobile view (sidebar open)
9. ✅ Mobile view (ticket detail)
10. ✅ SLA timer (both green and red states)

---

## ✅ FINAL VISUAL CHECK

**Walk through this user journey:**

1. Login → See floating button ✅
2. Click button → Form opens ✅
3. Type "urgent bug" → AI suggests category ✅
4. Submit → Success message ✅
5. Navigate to /dashboard/support → Dashboard loads ✅
6. See new ticket in queue ✅
7. Click ticket → Detail page opens ✅
8. Add reply → Reply appears ✅
9. Change status → Badge updates ✅
10. Check mobile → Everything responsive ✅

**If all 10 steps work visually, the system is ready! 🎉**

---

**Testing Time:** ~15 minutes  
**Difficulty:** Easy  
**Visual Focus:** UI/UX verification  

**Last Updated:** 2025-10-10

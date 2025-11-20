# 🚀 SUPPORT DASHBOARD - QUICK SETUP GUIDE

## 📋 Prerequisites
- PostgreSQL database running
- Node.js backend server
- React frontend application
- Existing MR.CREAMS authentication system

---

## ⚡ QUICK START (5 Minutes)

### **Step 1: Run Database Migration**
```bash
cd /Users/Cappie/Documents/WCREAMS/backend
psql -U postgres -d wife_conflict_db -f migrations/008_create_support_tickets.sql
```

**Expected Output:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX (multiple)
CREATE FUNCTION
CREATE TRIGGER
INSERT 0 8  (categories)
INSERT 0 4  (SLA configs)
CREATE VIEW
```

### **Step 2: Verify Backend Route**
The route has been automatically added to `server.js`:
```javascript
const supportTicketsRouter = require('./routes/supportTickets');
app.use('/api/v1/support', supportTicketsRouter);
```

✅ **Already configured!**

### **Step 3: Restart Backend Server**
```bash
cd backend
npm start
# or
node server.js
```

### **Step 4: Verify Frontend Integration**
The frontend is already integrated! Check:
- ✅ `App.js` - Routes added
- ✅ `TicketSubmissionWidget` - Globally available
- ✅ Support pages created

### **Step 5: Test the System**

#### **A. Test Floating Ticket Widget (Any Page)**
1. Login to any account
2. Look for blue floating button (bottom-right)
3. Click to open ticket submission form
4. Fill out form and submit
5. Check database for new ticket

#### **B. Test Support Dashboard**
1. Login as support/admin user
2. Navigate to `/dashboard/support`
3. View ticket queue
4. Click on a ticket to see details
5. Add a comment/reply
6. Change status/priority

---

## 🧪 TESTING COMMANDS

### **Database Verification**
```sql
-- Check tables created
\dt support*
\dt ticket*
\dt satisfaction*

-- Check ticket categories
SELECT * FROM ticket_categories;

-- Check SLA configs
SELECT * FROM ticket_sla_configs;

-- View statistics
SELECT * FROM ticket_statistics;
```

### **API Testing (using curl)**

#### Create a Ticket:
```bash
curl -X POST http://localhost:5000/api/v1/support/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test ticket",
    "description": "This is a test ticket",
    "priority": "medium"
  }'
```

#### List Tickets:
```bash
curl http://localhost:5000/api/v1/support/tickets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Dashboard Stats:
```bash
curl http://localhost:5000/api/v1/support/analytics/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔧 CONFIGURATION

### **Default Settings**

#### SLA Times (Configurable in database):
- **Critical:** 1 hour response, 4 hours resolution
- **High:** 4 hours response, 24 hours resolution
- **Medium:** 24 hours response, 3 days resolution
- **Low:** 3 days response, 7 days resolution

#### Default Categories:
1. Technical Issue (Red: #EF4444)
2. Billing (Orange: #F59E0B)
3. Feature Request (Blue: #3B82F6)
4. Account Management (Purple: #8B5CF6)
5. General Inquiry (Green: #10B981)
6. Bug Report (Dark Red: #DC2626)
7. Integration (Indigo: #6366F1)
8. Training (Teal: #14B8A6)

#### Agent Settings:
- Max tickets per agent: 10
- Auto-assignment: Enabled by default

---

## 👥 USER ROLES & ACCESS

### **Who Can Access What:**

| Feature | Super Admin | Admin | Support | Regular User |
|---------|------------|-------|---------|--------------|
| View Support Dashboard | ✅ | ✅ | ✅ | ❌ |
| Submit Tickets | ✅ | ✅ | ✅ | ✅ |
| View All Tickets | ✅ | ✅ | ✅ | ❌ |
| View Own Tickets | ✅ | ✅ | ✅ | ✅ |
| Assign Tickets | ✅ | ✅ | ✅ | ❌ |
| Update Any Ticket | ✅ | ✅ | ✅ | ❌ |
| Delete Tickets | ✅ | ✅ | ❌ | ❌ |
| Bulk Operations | ✅ | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ❌ |

---

## 🎯 USAGE EXAMPLES

### **For End Users (Any Role):**

1. **Submit a Ticket:**
   - Click floating blue button (bottom-right)
   - Fill in title and description
   - AI will suggest category and priority
   - Click "Submit Ticket"
   - Receive confirmation

2. **View Your Tickets:**
   - Navigate to support dashboard (if you have access)
   - Or wait for email notification (when implemented)

### **For Support Agents:**

1. **View Ticket Queue:**
   - Login and go to `/dashboard/support`
   - See all open/assigned tickets
   - Use filters: All, Mine, Unassigned, High Priority

2. **Handle a Ticket:**
   - Click on ticket row
   - Read conversation thread
   - Add reply in comment box
   - Update status (Open → In Progress → Resolved)
   - Change priority if needed

3. **Bulk Operations:**
   - Select multiple tickets (checkboxes)
   - Choose bulk action:
     - Change Status
     - Assign To
     - Change Priority
   - Apply changes

### **For Admins:**

1. **Monitor Performance:**
   - View dashboard metrics
   - Check overdue tickets
   - Review CSAT scores
   - Monitor agent workload

2. **Manage Categories:**
   - Add/edit ticket categories
   - Assign colors
   - Set specializations

---

## 🔍 TROUBLESHOOTING

### **Issue: Floating button not showing**
**Solution:**
- Check if user is authenticated
- Verify `TicketSubmissionWidget` is in `App.js`
- Check browser console for errors

### **Issue: "Failed to fetch tickets"**
**Solution:**
- Verify database migration ran successfully
- Check backend server is running
- Verify API route is registered in `server.js`
- Check user has proper role/permissions

### **Issue: Auto-assignment not working**
**Solution:**
- Verify `support_agents` table has entries
- Check agents have `is_available = true`
- Ensure `current_ticket_count < max_tickets`
- Run: `SELECT * FROM support_agents;`

### **Issue: SLA timer showing incorrect time**
**Solution:**
- Check `ticket_sla_configs` table
- Verify priority matches config
- Check system timezone settings

---

## 📊 MONITORING

### **Key Metrics to Track:**

```sql
-- Daily ticket volume
SELECT DATE(created_at) as date, COUNT(*) as tickets
FROM support_tickets
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Average response time by priority
SELECT priority, AVG(response_time_minutes) as avg_response
FROM support_tickets
WHERE response_time_minutes IS NOT NULL
GROUP BY priority;

-- Agent workload
SELECT u.name, sa.current_ticket_count, sa.max_tickets
FROM support_agents sa
JOIN users u ON sa.user_id = u.id
ORDER BY sa.current_ticket_count DESC;

-- Overdue tickets
SELECT COUNT(*) as overdue_count
FROM support_tickets t
JOIN ticket_sla_configs sla ON t.priority = sla.priority
WHERE t.status NOT IN ('resolved', 'closed')
AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - t.created_at)) / 60 > sla.resolution_minutes;
```

---

## 🚀 DEPLOYMENT CHECKLIST

### **Pre-Production:**
- [ ] Run database migration
- [ ] Verify all tables created
- [ ] Insert default categories
- [ ] Configure SLA times
- [ ] Set up support agents
- [ ] Test ticket creation
- [ ] Test ticket assignment
- [ ] Test bulk operations
- [ ] Verify permissions
- [ ] Test mobile responsiveness

### **Production:**
- [ ] Backup database before migration
- [ ] Run migration during low-traffic period
- [ ] Monitor error logs
- [ ] Test critical workflows
- [ ] Train support team
- [ ] Document internal procedures
- [ ] Set up monitoring alerts
- [ ] Configure email notifications (future)

---

## 📧 NEXT STEPS (Optional Enhancements)

### **Phase 2 Features:**

1. **Email Integration:**
   - Email notifications on ticket updates
   - Reply-by-email functionality
   - Email-to-ticket conversion

2. **Real-time Updates:**
   - WebSocket integration
   - Live activity feed
   - Desktop notifications

3. **Advanced Analytics:**
   - Agent performance dashboards
   - Customer satisfaction trends
   - SLA compliance reports
   - Ticket volume forecasting

4. **File Attachments:**
   - Upload screenshots/documents
   - Image preview
   - File size limits

5. **Knowledge Base:**
   - Self-service articles
   - FAQ integration
   - Auto-suggest solutions

---

## 🆘 SUPPORT

### **Common Questions:**

**Q: How do I add a support agent?**
```sql
INSERT INTO support_agents (user_id, max_tickets, specialization_tags, is_available)
VALUES ('user-uuid-here', 10, ARRAY['technical', 'billing'], true);
```

**Q: How do I change SLA times?**
```sql
UPDATE ticket_sla_configs
SET first_response_minutes = 120, resolution_minutes = 480
WHERE priority = 'high';
```

**Q: How do I add a new category?**
```sql
INSERT INTO ticket_categories (name, description, color, is_active)
VALUES ('New Category', 'Description here', '#FF5733', true);
```

**Q: How do I view all tickets for a specific user?**
```sql
SELECT t.*, u.name as requester_name
FROM support_tickets t
JOIN users u ON t.requester_id = u.id
WHERE u.email = 'user@example.com'
ORDER BY t.created_at DESC;
```

---

## ✅ VERIFICATION CHECKLIST

After setup, verify these work:

### **Frontend:**
- [ ] Floating ticket button visible on all authenticated pages
- [ ] Ticket submission form opens and works
- [ ] AI suggestions appear when typing
- [ ] Support dashboard loads without errors
- [ ] Ticket list displays correctly
- [ ] Clicking ticket opens detail view
- [ ] Can add comments/replies
- [ ] Status/priority dropdowns work
- [ ] Bulk selection and actions work
- [ ] Search and filters function
- [ ] Mobile view is responsive

### **Backend:**
- [ ] All API endpoints respond
- [ ] Tickets are created in database
- [ ] Auto-assignment works
- [ ] Activity logging works
- [ ] SLA calculations are correct
- [ ] Permissions are enforced
- [ ] Bulk updates work
- [ ] Analytics return data

### **Database:**
- [ ] All tables exist
- [ ] Indexes are created
- [ ] Triggers fire correctly
- [ ] Foreign keys enforce relationships
- [ ] Statistics view returns data
- [ ] Default data is inserted

---

## 🎉 SUCCESS INDICATORS

You'll know the system is working when:

1. ✅ Users can submit tickets from any page
2. ✅ Tickets appear in support dashboard
3. ✅ Auto-assignment distributes tickets to agents
4. ✅ Support agents can reply and update tickets
5. ✅ Status changes are logged in activity feed
6. ✅ SLA timer shows correct time remaining
7. ✅ Dashboard metrics update in real-time
8. ✅ Bulk operations affect multiple tickets
9. ✅ Search and filters narrow down results
10. ✅ Mobile users can access all features

---

## 📞 CONTACT

For issues or questions:
- Check `SUPPORT_DASHBOARD_IMPLEMENTATION.md` for detailed documentation
- Review backend logs: `backend/logs/`
- Check browser console for frontend errors
- Verify database connection and permissions

---

**Setup Time:** ~5 minutes  
**Difficulty:** Easy  
**Status:** Production-Ready ✅

**Last Updated:** 2025-10-10

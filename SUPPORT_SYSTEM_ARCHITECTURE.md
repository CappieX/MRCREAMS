# 🏗️ SUPPORT SYSTEM ARCHITECTURE

## 📐 COMPLETE SYSTEM DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MR.CREAMS PLATFORM                                  │
│                     (Emotion Analysis & Therapy System)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────────┐         ┌───────────────────────┐
        │   FRONTEND (React)    │         │   BACKEND (Node.js)   │
        │                       │         │                       │
        │  ┌─────────────────┐  │         │  ┌─────────────────┐  │
        │  │  Universal      │  │         │  │  Support API    │  │
        │  │  Ticket Widget  │  │◄────────┼──┤  /api/v1/support│  │
        │  │  (Floating FAB) │  │  REST   │  │                 │  │
        │  └─────────────────┘  │  API    │  └─────────────────┘  │
        │                       │         │           │           │
        │  ┌─────────────────┐  │         │           │           │
        │  │ Support         │  │         │           ▼           │
        │  │ Dashboard       │  │◄────────┼──┤  Authentication  │  │
        │  │ - Home          │  │         │  │  Middleware      │  │
        │  │ - Ticket List   │  │         │  └─────────────────┘  │
        │  │ - Ticket Detail │  │         │           │           │
        │  └─────────────────┘  │         │           ▼           │
        │                       │         │  ┌─────────────────┐  │
        │  ┌─────────────────┐  │         │  │  Business Logic │  │
        │  │ All Other Pages │  │         │  │  - CRUD Ops     │  │
        │  │ (Dashboard,     │  │         │  │  - Auto-assign  │  │
        │  │  Therapist,     │  │         │  │  - SLA Calc     │  │
        │  │  Admin, etc.)   │  │         │  │  - Permissions  │  │
        │  └─────────────────┘  │         │  └─────────────────┘  │
        │          │            │         │           │           │
        └──────────┼────────────┘         └───────────┼───────────┘
                   │                                  │
                   │                                  ▼
                   │                      ┌───────────────────────┐
                   │                      │  DATABASE (PostgreSQL) │
                   │                      │                        │
                   │                      │  ┌──────────────────┐  │
                   │                      │  │ support_tickets  │  │
                   │                      │  │ - id, number     │  │
                   │                      │  │ - title, desc    │  │
                   │                      │  │ - status, priority│ │
                   │                      │  │ - timestamps     │  │
                   │                      │  └──────────────────┘  │
                   │                      │           │           │
                   │                      │           ▼           │
                   │                      │  ┌──────────────────┐  │
                   │                      │  │ticket_activities │  │
                   │                      │  │ - comments       │  │
                   │                      │  │ - status changes │  │
                   │                      │  │ - assignments    │  │
                   │                      │  └──────────────────┘  │
                   │                      │           │           │
                   │                      │           ▼           │
                   │                      │  ┌──────────────────┐  │
                   │                      │  │ support_agents   │  │
                   │                      │  │ - availability   │  │
                   │                      │  │ - workload       │  │
                   │                      │  └──────────────────┘  │
                   │                      │           │           │
                   │                      │           ▼           │
                   │                      │  ┌──────────────────┐  │
                   │                      │  │ticket_categories │  │
                   │                      │  │ticket_sla_configs│  │
                   │                      │  │satisfaction_surveys│
                   │                      │  └──────────────────┘  │
                   │                      └───────────────────────┘
                   │
                   ▼
        ┌───────────────────────┐
        │   USER INTERACTIONS   │
        │                       │
        │  1. Click FAB button  │
        │  2. Fill ticket form  │
        │  3. AI suggests       │
        │  4. Submit ticket     │
        │  5. View in dashboard │
        │  6. Agent responds    │
        │  7. Status updates    │
        │  8. Resolution        │
        └───────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAMS

### **1. Ticket Creation Flow**

```
User (Any Page)
    │
    ├─► Clicks Floating Action Button
    │
    ├─► Opens TicketSubmissionWidget
    │
    ├─► Types Title & Description
    │       │
    │       ├─► AI Analyzes Text
    │       │       │
    │       │       ├─► Detects Keywords
    │       │       ├─► Suggests Category
    │       │       └─► Suggests Priority
    │       │
    │       └─► User Reviews Suggestions
    │
    ├─► Clicks "Submit Ticket"
    │
    ├─► POST /api/v1/support/tickets
    │       │
    │       ├─► Validates Input
    │       ├─► Creates Ticket Record
    │       ├─► Generates Ticket Number (TKT-0001)
    │       ├─► Logs Activity (ticket_activities)
    │       ├─► Runs Auto-Assignment Algorithm
    │       │       │
    │       │       ├─► Finds Available Agents
    │       │       ├─► Checks Specialization
    │       │       ├─► Checks Workload
    │       │       └─► Assigns to Best Agent
    │       │
    │       └─► Returns Ticket Object
    │
    └─► Shows Success Message
            │
            └─► Ticket appears in Support Dashboard
```

---

### **2. Ticket Detail & Reply Flow**

```
Support Agent
    │
    ├─► Navigates to /dashboard/support
    │
    ├─► Views Ticket Queue
    │
    ├─► Clicks on Ticket Row
    │
    ├─► GET /api/v1/support/tickets/:id
    │       │
    │       ├─► Fetches Ticket Data
    │       ├─► Fetches All Activities
    │       ├─► Calculates SLA Status
    │       └─► Returns Complete Ticket
    │
    ├─► Views Conversation Thread
    │
    ├─► Types Reply in Comment Box
    │
    ├─► Clicks "Send Reply"
    │
    ├─► POST /api/v1/support/tickets/:id/comments
    │       │
    │       ├─► Creates Activity Record
    │       ├─► Updates first_response_at (if first)
    │       ├─► Calculates response_time_minutes
    │       └─► Returns Activity
    │
    ├─► Updates Status Dropdown
    │
    ├─► PUT /api/v1/support/tickets/:id
    │       │
    │       ├─► Updates Ticket Status
    │       ├─► Logs Status Change Activity
    │       ├─► Sets resolved_at (if resolved)
    │       ├─► Calculates resolution_time_minutes
    │       └─► Returns Updated Ticket
    │
    └─► Ticket Resolved ✅
```

---

### **3. Auto-Assignment Algorithm**

```
New Ticket Created
    │
    ├─► Query: SELECT * FROM support_agents WHERE is_available = true
    │
    ├─► Filter: current_ticket_count < max_tickets
    │
    ├─► Check: Does ticket have category?
    │       │
    │       ├─► YES: Filter agents by specialization_tags
    │       │       │
    │       │       └─► Match: category IN specialization_tags
    │       │
    │       └─► NO: Use all available agents
    │
    ├─► Sort: ORDER BY current_ticket_count ASC, performance_score DESC
    │
    ├─► Select: First agent from sorted list
    │
    ├─► Assign Ticket
    │       │
    │       ├─► UPDATE support_tickets SET assigned_agent_id = ?
    │       ├─► UPDATE support_agents SET current_ticket_count = current_ticket_count + 1
    │       └─► INSERT INTO ticket_activities (activity_type = 'assignment')
    │
    └─► Agent Notified (Future: Email/Push)
```

---

### **4. Bulk Operations Flow**

```
Support Agent
    │
    ├─► Selects Multiple Tickets (Checkboxes)
    │
    ├─► Clicks "Change Status" (or other bulk action)
    │
    ├─► Opens Bulk Action Dialog
    │
    ├─► Selects New Status
    │
    ├─► Clicks "Apply to X Tickets"
    │
    ├─► POST /api/v1/support/tickets/bulk-update
    │       │
    │       ├─► BEGIN TRANSACTION
    │       │
    │       ├─► FOR EACH ticket_id:
    │       │       │
    │       │       ├─► UPDATE support_tickets SET status = ?
    │       │       ├─► INSERT INTO ticket_activities
    │       │       └─► Update related tables (if needed)
    │       │
    │       ├─► COMMIT TRANSACTION
    │       │
    │       └─► Returns Success Message
    │
    └─► Refreshes Ticket List
```

---

## 🗄️ DATABASE RELATIONSHIPS

```
┌──────────────────┐
│     users        │
│ (Existing Table) │
└────────┬─────────┘
         │
         │ 1:N (requester)
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│ support_tickets  │◄────────┤ticket_categories │
│                  │  N:1    │                  │
│ - id             │         │ - id             │
│ - ticket_number  │         │ - name           │
│ - title          │         │ - color          │
│ - description    │         └──────────────────┘
│ - status         │
│ - priority       │         ┌──────────────────┐
│ - category_id    │────────►│ticket_sla_configs│
│ - assigned_agent │  N:1    │                  │
│ - requester_id   │         │ - priority       │
│ - organization_id│         │ - response_mins  │
│ - created_at     │         │ - resolution_mins│
│ - resolved_at    │         └──────────────────┘
└────────┬─────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────┐
│ticket_activities │
│                  │
│ - id             │
│ - ticket_id      │
│ - user_id        │
│ - activity_type  │
│ - content        │
│ - is_internal    │
│ - created_at     │
└──────────────────┘

┌──────────────────┐
│ support_agents   │
│                  │
│ - user_id (PK)   │◄────────┐
│ - max_tickets    │         │
│ - specialization │         │ 1:1
│ - is_available   │         │
│ - current_count  │         │
│ - performance    │         │
└──────────────────┘         │
                              │
                    ┌─────────┴─────┐
                    │     users     │
                    │ (Agents Only) │
                    └───────────────┘

┌──────────────────┐
│satisfaction_     │
│  surveys         │
│                  │
│ - id             │
│ - ticket_id      │◄────────┐
│ - rating (1-5)   │         │ N:1
│ - feedback       │         │
│ - submitted_at   │         │
└──────────────────┘         │
                    ┌─────────┴─────┐
                    │support_tickets│
                    └───────────────┘
```

---

## 🔐 SECURITY LAYERS

```
┌─────────────────────────────────────────────────────┐
│                   SECURITY STACK                     │
└─────────────────────────────────────────────────────┘

Layer 1: Authentication
    │
    ├─► JWT Token Validation
    ├─► Token Expiration Check
    └─► User Session Management

Layer 2: Authorization
    │
    ├─► Role-Based Access Control (RBAC)
    │       │
    │       ├─► Super Admin: Full Access
    │       ├─► Admin: Full Access
    │       ├─► Support: Limited Access
    │       └─► User: Own Tickets Only
    │
    └─► Resource-Level Permissions
            │
            ├─► Can view this ticket?
            ├─► Can update this ticket?
            └─► Can delete this ticket?

Layer 3: Data Validation
    │
    ├─► Input Sanitization
    ├─► SQL Injection Prevention (Parameterized Queries)
    ├─► XSS Protection
    └─► CSRF Protection

Layer 4: Audit Trail
    │
    ├─► All Actions Logged (ticket_activities)
    ├─► User ID Tracked
    ├─► Timestamp Recorded
    └─► Metadata Stored (old/new values)

Layer 5: Database Security
    │
    ├─► Foreign Key Constraints
    ├─► Check Constraints (status, priority)
    ├─► Unique Constraints (ticket_number)
    └─► Cascade Deletes (activities)
```

---

## 📊 PERFORMANCE OPTIMIZATION

```
┌─────────────────────────────────────────────────────┐
│              PERFORMANCE STRATEGIES                  │
└─────────────────────────────────────────────────────┘

Database Level:
    │
    ├─► Indexes on Key Columns
    │       ├─► idx_tickets_status
    │       ├─► idx_tickets_priority
    │       ├─► idx_tickets_assigned_agent
    │       ├─► idx_tickets_requester
    │       └─► idx_tickets_created_at
    │
    ├─► Materialized View (ticket_statistics)
    │
    └─► Efficient JOINs (LEFT JOIN for optional relations)

Backend Level:
    │
    ├─► Server-Side Pagination (20 items per page)
    ├─► Query Parameter Filtering
    ├─► Parameterized Queries (Prepared Statements)
    └─► Connection Pooling

Frontend Level:
    │
    ├─► React Component Optimization
    │       ├─► useMemo for expensive calculations
    │       ├─► useCallback for event handlers
    │       └─► React.memo for pure components
    │
    ├─► Debounced Search Input (300ms delay)
    ├─► Lazy Loading (Routes with React.lazy)
    ├─► Code Splitting (Dynamic imports)
    └─► Optimistic UI Updates

Caching Strategy (Future):
    │
    ├─► Redis for Session Storage
    ├─► Cache Ticket Categories
    ├─► Cache SLA Configurations
    └─► Cache User Permissions
```

---

## 🔄 STATE MANAGEMENT

```
┌─────────────────────────────────────────────────────┐
│              REACT STATE ARCHITECTURE                │
└─────────────────────────────────────────────────────┘

Global State (Context API):
    │
    ├─► AuthContext
    │       ├─► user (current user object)
    │       ├─► isAuthenticated
    │       └─► login/logout functions
    │
    └─► ThemeContext
            ├─► theme (light/dark)
            └─► toggleTheme function

Component State (useState):
    │
    ├─► TicketSubmissionWidget
    │       ├─► formData (title, description, priority, category)
    │       ├─► aiSuggestion (category, priority)
    │       ├─► loading, success, error
    │       └─► categories (fetched from API)
    │
    ├─► SupportHome
    │       ├─► tickets (array)
    │       ├─► stats (metrics object)
    │       ├─► recentActivity (array)
    │       ├─► loading
    │       └─► filter (all, mine, unassigned, high-priority)
    │
    ├─► TicketDetail
    │       ├─► ticket (full ticket object)
    │       ├─► comment (reply text)
    │       ├─► submitting
    │       └─► error
    │
    └─► AllTickets
            ├─► tickets (array)
            ├─► selected (array of IDs)
            ├─► searchQuery
            ├─► statusFilter, priorityFilter
            ├─► page, totalPages
            └─► bulkAction (type, value)

Server State (API Calls):
    │
    ├─► axios.get('/api/v1/support/tickets')
    ├─► axios.post('/api/v1/support/tickets')
    ├─► axios.put('/api/v1/support/tickets/:id')
    └─► axios.get('/api/v1/support/analytics/overview')
```

---

## 🎯 INTEGRATION POINTS

```
┌─────────────────────────────────────────────────────┐
│         INTEGRATION WITH EXISTING SYSTEMS            │
└─────────────────────────────────────────────────────┘

1. User Management
    │
    ├─► Uses existing 'users' table
    ├─► Respects user roles (super_admin, admin, support, etc.)
    └─► Links to user authentication flow

2. Organization Structure
    │
    ├─► Links to 'organizations' table
    ├─► Supports multi-tenancy
    └─► Organization-specific categories

3. Emotion Analysis (Future Integration)
    │
    ├─► Analyze sentiment in ticket descriptions
    ├─► Detect frustration levels
    ├─► Auto-escalate high-emotion tickets
    └─► Provide emotion insights to agents

4. Therapy Sessions (Future Integration)
    │
    ├─► Link tickets to therapy sessions
    ├─► Allow therapists to create tickets
    ├─► Track session-related issues
    └─► Generate session reports

5. Notification System (Future)
    │
    ├─► Email notifications
    ├─► Push notifications
    ├─► SMS alerts (critical tickets)
    └─► In-app notifications
```

---

## 📱 RESPONSIVE DESIGN BREAKPOINTS

```
┌─────────────────────────────────────────────────────┐
│              RESPONSIVE LAYOUT STRATEGY              │
└─────────────────────────────────────────────────────┘

Desktop (≥1200px):
    │
    ├─► Persistent Sidebar (280px)
    ├─► Full Table View
    ├─► 3-Column Layouts
    └─► All Features Visible

Tablet (768px - 1199px):
    │
    ├─► Collapsible Sidebar
    ├─► 2-Column Layouts
    ├─► Horizontal Scroll for Tables
    └─► Condensed Metrics

Mobile (≤767px):
    │
    ├─► Temporary Drawer Sidebar
    ├─► Single Column Layout
    ├─► Card-Based Ticket List
    ├─► Stacked Forms
    └─► Touch-Optimized Controls

Floating Action Button:
    │
    └─► Visible on ALL screen sizes
        └─► Fixed position: bottom-right (24px)
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│              PRODUCTION DEPLOYMENT                   │
└─────────────────────────────────────────────────────┘

Development:
    │
    ├─► Local PostgreSQL
    ├─► Node.js Dev Server (nodemon)
    ├─► React Dev Server (npm start)
    └─► Hot Module Replacement

Staging:
    │
    ├─► Cloud Database (AWS RDS / Azure PostgreSQL)
    ├─► Node.js Server (PM2)
    ├─► React Build (npm run build)
    └─► HTTPS (SSL/TLS)

Production:
    │
    ├─► Load Balancer
    │       │
    │       ├─► Node.js Server 1
    │       ├─► Node.js Server 2
    │       └─► Node.js Server N
    │
    ├─► Database Cluster (Primary + Replicas)
    ├─► CDN for Static Assets
    ├─► Redis Cache
    └─► Monitoring (Datadog, New Relic, etc.)
```

---

## ✅ SYSTEM HEALTH CHECKS

```
Monitoring Endpoints:
    │
    ├─► GET /health
    │       └─► Returns: { status: 'ok', timestamp: ... }
    │
    ├─► GET /api/v1/support/health
    │       └─► Checks database connection
    │
    └─► Database Metrics
            ├─► Active connections
            ├─► Query performance
            └─► Table sizes

Key Metrics to Monitor:
    │
    ├─► API Response Times
    ├─► Error Rates (4xx, 5xx)
    ├─► Database Query Performance
    ├─► Ticket Creation Rate
    ├─► Average Resolution Time
    └─► User Satisfaction Score
```

---

**Architecture Version:** 1.0  
**Last Updated:** 2025-10-10  
**Status:** Production-Ready ✅

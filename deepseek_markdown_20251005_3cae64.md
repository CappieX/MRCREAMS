# 🚀 Quick Start Guide

## 5-Minute Setup

### 1. Prerequisites Check
- [ ] Node.js installed (`node --version`)
- [ ] PostgreSQL installed (`psql --version`)
- [ ] VS Code installed

### 2. Database Setup (One-time)
```sql
-- In PostgreSQL, run these commands:
CREATE DATABASE wife_conflict_db;
\c wife_conflict_db
\i backend/database.sql
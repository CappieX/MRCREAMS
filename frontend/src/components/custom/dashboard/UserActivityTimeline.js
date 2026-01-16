import React from 'react';
import { BRAND_COLORS } from '../../../assets/brand';

const events = [
  {
    time: '09:12',
    label: 'New therapist onboarded',
    meta: 'Dr. Ramos · Chicago'
  },
  {
    time: '10:03',
    label: 'High-sensitivity ticket escalated',
    meta: 'Support · Couple therapy'
  },
  {
    time: '11:27',
    label: 'Organization billing updated',
    meta: 'Enum Labs · Annual'
  },
  {
    time: '13:45',
    label: 'Executive report exported',
    meta: 'Platform health overview'
  }
];

const UserActivityTimeline = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      {events.map((event) => (
        <div
          key={event.time + event.label}
          style={{
            display: 'grid',
            gridTemplateColumns: '64px 1fr',
            gap: 12,
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'rgba(100,116,139,1)'
            }}
          >
            {event.time}
          </div>
          <div
            style={{
              position: 'relative',
              paddingLeft: 16
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 6,
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: BRAND_COLORS.teal,
                boxShadow: '0 0 0 4px rgba(0,180,216,0.1)'
              }}
            />
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a'
              }}
            >
              {event.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(100,116,139,0.95)'
              }}
            >
              {event.meta}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserActivityTimeline;


import React from 'react';
import Login from './Login';

// OrganizerLogin simply reuses the Login component but with a different heading/context
export default function OrganizerLogin() {
  return <Login organizerMode={true} />;
}

// src/pages/tutor-flow/tutor-registration.tsx

import type { NextPage } from 'next';

// 1. Import your fixed component from the 'components' folder
import TutorRegistration from '../../components/tutor-flow/TutorRegistration';

// 2. Create the page component
const TutorRegistrationPage: NextPage = () => {
  // 3. Render the component you imported
  return <TutorRegistration />;
};

export default TutorRegistrationPage;

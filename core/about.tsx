import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';


const AboutPage: React.FunctionComponent = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.query) {
      setMessage('The parameter is ' + router.query);
    } else {
      setMessage('No parameter was provided');
    }
  }, [router.query]);

  return (
    <div>
      <p>This is the about page.</p>
      <p>{message}</p>
    </div>
  );
};

export default AboutPage;

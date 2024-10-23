import { useEffect } from 'react';

const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://localhost/TCC/view/TelaloginUser.php';
  }, []);

  return null;
};

export default AdminRedirect;

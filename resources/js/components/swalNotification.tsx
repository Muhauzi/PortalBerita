import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { usePage } from '@inertiajs/react';

interface FlashProps {
  success?: string;
  error?: string;
}

const SwalNotification: React.FC = () => {
  const { props } = usePage<{ flash?: FlashProps }>();

  // Pesan success dan error diasumsikan dikirim dari Laravel lewat session flash
  const successMessage = props.flash?.success;
  const errorMessage = props.flash?.error;

  useEffect(() => {
    if (successMessage) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: successMessage,
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
        position: 'top-end',
        toast: true,
      });
    } else if (errorMessage) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        position: 'top-end',
        toast: true,
      });
    }
  }, [successMessage, errorMessage]);

  return null;
};

export default SwalNotification;

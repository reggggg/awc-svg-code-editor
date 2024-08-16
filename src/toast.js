import { Toast } from 'bootstrap';

export const toast = {
  success(title) {
    showToast(title, true);
  },
  error(title) {
    showToast(title, false);
  },
};

function showToast(title, isSuccess = true) {
  const toastElement = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');

  toastTitle.textContent = title;

  // Set the toast background color based on success or error
  if (isSuccess) {
    toastElement.classList.remove('bg-danger');
    toastElement.classList.add('bg-success');
  } else {
    toastElement.classList.remove('bg-success');
    toastElement.classList.add('bg-danger');
  }

  const bootstrapToast = new Toast(toastElement);
  bootstrapToast.show();
}
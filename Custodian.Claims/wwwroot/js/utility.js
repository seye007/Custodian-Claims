export const Utility = (() => {
  const icons = ['error', 'success'];
  const titles = ['Invalid Input', 'Claim Request Successful', 'Internal Server Error'];

  function validateFormElements(form) {
    const formElements = form.querySelectorAll('input, textarea');
    let isValid = true;

    for (const element of formElements) {
      const name = element.name;
      const value = element.value;
      const errorMessage = element.getAttribute('data-error') || `${pascalToWords(name)} is required.`;

      if (element.hasAttribute('required') && !value.trim()) {
        alertMessage(icons[0], titles[0], errorMessage);
        isValid = false;
        break;
      } else if (name === 'emailAddress' && !validateEmail(value)) {
        alertMessage(icons[0], titles[0], 'Invalid Email Address');
        isValid = false;
        break;
      } else if (name === 'phoneNumber' && !validPhoneNumber(value)) {
        alertMessage(icons[0], titles[0], 'Invalid Phone Number');
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validPhoneNumber(phoneNumber) {
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
    return numericPhoneNumber.length === 11;
  }

  function pascalToWords(pascalString) {
    const result = pascalString.replace(/([a-z])([A-Z])/g, '$1 $2');
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  }

  function alertMessage(icon, title, message) {
    Swal.fire({
      icon: icon,
      title: title,
      text: message,
    });
  }

  return {
    validateFormElements: validateFormElements,
    alertMessage: alertMessage,
    icons: icons,
    titles: titles
  };
})();

const clearInvalidFields = (form, keysArr) => {
  for (const key of keysArr) {
    const inputElement = form.querySelector(`#${key}`);
    inputElement.classList.remove('invalid-input');
  }
};

const showInvalidFields = (form, invalidFields) => {
  for (const field of invalidFields) {
    const inputElement = form.querySelector(`#${field}`);
    inputElement.classList.add('invalid-input');
  }
};

const validateFormField = (validationRegexps, key, value) =>
  validationRegexps[key].test(value);

export const validateForm = (form, validationRegexps) => {
  const formData = new FormData(form);
  const formDataValues = {};
  const invalidFields = [];
  for (const [key, value] of formData) {
    formDataValues[key] = value;

    const isValid = validateFormField(validationRegexps, key, value);

    if (!isValid) invalidFields.push(key);
  }

  clearInvalidFields(form, Object.keys(formDataValues));
  if (invalidFields.length !== 0) {
    showInvalidFields(form, invalidFields);
    return [false, formDataValues];
  }

  return [true, formDataValues];
};

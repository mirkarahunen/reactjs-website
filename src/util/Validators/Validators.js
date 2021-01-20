const VALIDATOR_TYPE_REQUIRE = 'REQUIRE'
const VALIDATOR_TYPE_EMAIL = 'EMAIL'
const VALIDATOR_TYPE_PASSWORD = 'PASSWORD'
const VALIDATOR_TYPE_PASSWORD_REPEAT = 'PASSWORD REPEAT'


export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE })
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL })
export const VALIDATOR_PASSWORD = (val) => ({ type: VALIDATOR_TYPE_PASSWORD, val: val })
export const VALIDATOR_PASSWORD_REPEAT = (val) => ({ type: VALIDATOR_TYPE_PASSWORD_REPEAT, value: val })


export const validate = (value, Validators) => {
  let isValid = true;
  for (const Validator of Validators) {
    if (Validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 1;
    }
    if (Validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
    }
    if (Validator.type === VALIDATOR_TYPE_PASSWORD) {
      let passwordValue = value
        isValid = isValid && /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#.+-_$%^&*])(?=.{8,32})/.test(passwordValue);

      }
    
    
  }
  return isValid;
};

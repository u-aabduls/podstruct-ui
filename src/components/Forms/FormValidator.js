// https://github.com/chriso/validator.js
import validator from 'validator';

/**
 * Helper methods to validate form inputs
 * using controlled components
 */
const FormValidator = {

    /**
     * Returns true iff:
     *     1) input is alpha only
     *     2) input's only special character (if exists) is apostrophe (') or hyphen (-)
     */
    isValidName(input) {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        var i = input.length;
        input = input.toUpperCase();
        while (i--) {
            var char = input.charAt(i);
            if (!alpha.includes(char) && (char != '\'' && char != '-')) {
                return false;
            }
        }
        return true;
    },

    /**
     * Returns true iff:
     *     1) input is alphanumeric
     *     2) input's only special character (if exists) is hyphen (-) 
     */
    isValidPODName(input) {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const num = "0123456789".split("");

        // name not valid if less than 2 characters long
        if (input.length < 2) {
            return false;
        }

        var i = input.length;
        input = input.toUpperCase();
        while (i--) {
            var char = input.charAt(i);
            if (!alpha.includes(char) && !num.includes(char)) {
                if (char != '-') {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * Returns true iff:
     *     1) input is at least 8 chars long
     *     2) input contains 1 upper case letter 
     *     3) input contains 1 lower case letter
     *     4) input contains 1 number 
     *     5) input contains 1 special character
     */
    isValidPassword(input) {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const alphaLower = "abcdefghijklmnopqrstuvwxyz".split("");
        const num = "0123456789".split("");
        const special = "`~!@#$%^&*()-_=+[{]};:,<.>/?".split("");

        if (input.length < 8) {
            return false;
        }

        var i = input.length,
            upperFound = false,
            lowerFound = false,
            numFound = false,
            specialFound = false;

        while (i--) {
            var char = input.charAt(i);
            if (!upperFound && alpha.includes(char)) {
                upperFound = true;
            }
            if (!lowerFound && alphaLower.includes(char)) {
                lowerFound = true;
            }
            if (!numFound && num.includes(char)) {
                numFound = true;
            }
            if (!specialFound && special.includes(char)) {
                specialFound = true;
            }
        }
        return upperFound && lowerFound && numFound && specialFound;
    },

    /**
     * Validate input element
     * @param element Dome element of the input
     * Uses the following attributes
     *     data-validate: array in json format with validation methods
     *     data-param: used to provide arguments for certain methods.
     */
    validate(element) {

        const isCheckbox = element.type === 'checkbox';
        const value = isCheckbox ? element.checked : element.value;
        const name = element.name;

        if (!name) throw new Error('Input name must not be empty.');

        // use getAttribute to support IE10+
        const param = element.getAttribute('data-param');
        const validations = JSON.parse(element.getAttribute('data-validate'));

        let result = []
        if(validations && validations.length) {
            /*  Result of each validation must be true if the input is invalid
                and false if valid. */
            validations.forEach(m => {
                switch (m) {
                    case 'required':
                        result[m] = isCheckbox ? value === false : validator.isEmpty(value)
                        break;
                    case 'email':
                        result[m] = !validator.isEmail(value)
                        break;
                    case 'number':
                        result[m] = !validator.isNumeric(value)
                        break;
                    case 'integer':
                        result[m] = !validator.isInt(value)
                        break;
                    case 'alphanum':
                        result[m] = !validator.isAlphanumeric(value)
                        break;
                    case 'url':
                        result[m] = !validator.isURL(value)
                        break;
                    case 'equalto':
                        // here we expect a valid ID as param
                        const value2 = document.getElementById(param).value;
                        result[m] = !validator.equals(value, value2)
                        break;
                    case 'minlen':
                        result[m] = !validator.isLength(value, { min: param })
                        break;
                    case 'maxlen':
                        result[m] = !validator.isLength(value, { max: param })
                        break;
                    case 'len':
                        const [min, max] = JSON.parse(param)
                        result[m] = !validator.isLength(value, { min, max })
                        break;
                    case 'min':
                        result[m] = !validator.isInt(value, { min: validator.toInt(param) })
                        break;
                    case 'max':
                        result[m] = !validator.isInt(value, { max: validator.toInt(param) })
                        break;
                    case 'list':
                        const list = JSON.parse(param)
                        result[m] = !validator.isIn(value, list)
                        break;
                    case 'name':
                        result[m] = !this.isValidName(value)
                        break;
                    case 'podname':
                        result[m] = !this.isValidPODName(value)
                        break;
                    case 'password':
                        result[m] = !this.isValidPassword(value)
                        break;
                    default:
                        throw new Error('Unrecognized validator.');
                }

            })
        }

        return result;
    },

    /**
     * Bulk validation of input elements.
     * Used with form elements collection.
     * @param  {Array} inputs Array for DOM element
     * @return {Object}       Contains array of error and a flag to
     *                        indicate if there was a validation error
     */
    bulkValidate(inputs) {
        let errors = {},
            hasError = false;

        inputs.forEach(input => {
            let result = this.validate(input)
            errors = { ...errors, [input.name]: result }
            if (!hasError) hasError = Object.keys(result).some(val => result[val])
        })

        return {
            errors,
            hasError
        }
    }
}

export default FormValidator;
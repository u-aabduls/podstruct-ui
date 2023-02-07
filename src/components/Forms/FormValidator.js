// https://github.com/chriso/validator.js
import validator from 'validator';

/**
 * Helper methods to validate form inputs
 * using controlled components
 */
const FormValidator = {

    /**
     * Returns true iff:
     *     1) input begins or ends with a space character
     */
    beginsOrEndsWithSpace(input) {
        return input.substring(0, 1) === " " || input.substring(input.length - 1, input.length) === " ";
    },

    /**
     * Returns true iff:
     *     1) input contains consecutive spaces
     */
    containsConsecutiveSpaces(input) {
        var index = input.indexOf(" ");
        if (index < 0 || index === input.length - 1) {
            return false;
        } else {
            return input.charAt(index + 1) === " ";
        }
    },

    /**
     * Returns true iff:
     *     1) input contains at least 1 alpha character OR is empty
     */
    containsAlphaChar(input) {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        var i = input.length;

        if (i === 0) {
            return true;
        }
        input = input.toUpperCase();
        while (i--) {
            var char = input.charAt(i);
            if (alpha.includes(char)) {
                return true;
            }
        }
        return false;
    },

    /**
     * Returns true iff:
     *     1) input is alpha only and special character (if exists) is apostrophe (') or hyphen (-)
     */
    isValidName(input) {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");

        var i = input.length;
        input = input.toUpperCase();
        while (i--) {
            var char = input.charAt(i);
            if (!alpha.includes(char) && (char !== '\'' && char !== '-')) {
                return false;
            }
        }
        return true;
    },

    /**
     * Returns true iff:
     *     1) month & day together form a valid date of birth
     */
    isValidDateOfBirth(month, day) {
        const monthsWith30Days = ["1", "3", "5", "8", "10"];
        const monthsWith31Days = ["0", "2", "4", "6", "7", "9"];

        return (monthsWith30Days.includes(month) && day <= 30) || (monthsWith31Days.includes(month) && day <= 31);
    },

    /**
     * Returns true iff:
     *     1) input is alphanumeric (including space ' ')
     *     2) input's only special character (if exists) is hyphen (-) 
     */
    isValidPODName(input) {
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("");
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
                if (char !== '-') {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * Returns true iff:
     *     1) input has exactly 10 digits
     */
    containsTenDigits(input) {
        const num = "0123456789".split("");

        if (input.length < 10) {
            return false;
        }

        var i = input.length,
            numbers = 0;

        while (i--) {
            var char = input.charAt(i);
            if (num.includes(char)) {
                numbers++;
            }
        }
        return numbers === 10;
    },

    /**
     * Returns true iff:
     *     1) contains only numbers or '(',')', or '-' characters
     */
    containsInvalidChars(input) {
        const num = "0123456789".split("");
        const special = "()-".split("");

        var i = input.length,
            containsInvalidChar = false;

        while (i-- && !containsInvalidChar) {
            var char = input.charAt(i);
            if (!num.includes(char) && !special.includes(char)) {
                containsInvalidChar = true;
            }
        }
        return containsInvalidChar;
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
        if (validations && validations.length) {
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
                    case 'emails':
                        value.replace(/\s/g, "").split(",").map((email) => {
                            //allow trailing commas
                            if (!email){
                                return
                            }
                            if (!validator.isEmail(email)){
                                result[m] = true
                                return
                            }
                            result[m] = false
                        })
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
                    case 'contains-alpha':
                        result[m] = !this.containsAlphaChar(value)
                        break;
                    case 'name':
                        result[m] = !this.isValidName(value)
                        break;
                    case 'podname':
                        result[m] = !this.isValidPODName(value)
                        break;
                    case 'phone-digits':
                        result[m] = !this.containsTenDigits(value)
                        break;
                    case 'phone-chars':
                        result[m] = this.containsInvalidChars(value)
                        break;
                    case 'password':
                        result[m] = !this.isValidPassword(value)
                        break;
                    case 'begin-end-spacing':
                        result[m] = this.beginsOrEndsWithSpace(value)
                        break;
                    case 'consecutive-spacing':
                        result[m] = this.containsConsecutiveSpaces(value)
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
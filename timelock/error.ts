class ErrorHelper {
    static parse(error: any) {
        if('object' == typeof error) {
            if(error.hasOwnProperty('error')) {
                if(error.error.hasOwnProperty('reason')) {
                    return error.error.reason;
                }
                else {
                    return error.error.message;
                }
            }
            else {
                if(error.hasOwnProperty('message')){
                    error = error.message;
                    if(error.indexOf('(') > -1) {
                        error = error.substr(0, error.indexOf('('));
                    }                    
                    return error;
                }
                else {
                    if(error.indexOf('(') > -1) {
                        error = error.substr(error.indexOf('('));
                    }
                    return error;
                }
            }
        }
        else {
            return error;
        }
    }
}

export default ErrorHelper;
export const logger = (message?: any, ...optionalParams: any[]) => {
  if (process.env.LOG_OUT) {
    console.log(message, optionalParams);
  }
};

# Utility: Logger
Logger used to track the track record of the application. aims to facilitate the evaluation of the performance of an application.
## Production process

This logger recommends 3 levels commonly used in production process
### ERROR 
Usually this level is used to log exceptions when executing business processes or logic. Ideally, when we try to catch an exception, we log in and then throw the exception again without crashing the app.
Usage:
```js
const logger = require('./logger.utils')
logger.error('Insert your error here')
/* or if you want to add object you can write object to parameter. The object key name is up to you. However, make sure the name and value are important for easy tracking.
*/
// Example:
logger.error({
    message:'Insert your error here',
    method: 'Insert',
    path: '/'
    })
```
### WARN 
Usually this level is used to record conditions where an exception occurs in the system process.
Usage:
```js
const logger = require('./logger.utils')
logger.warn('Insert your error here')
/* or if you want to add object you can write object to parameter. The object key name is up to you. However, make sure the name and value are important for easy tracking.
*/
// Example:
logger.warn({
    message:'Insert your here',
    method: 'Insert',
    path: '/'
    })
```
### INFO 
This level is most often used and should be used to summarize or review every business process carried out, so that the auditing process can be carried out by reading log files.
Usage:
```js
const logger = require('./logger.utils')
logger.info('Insert your error here')
/* or if you want to add object you can write object to parameter. The object key name is up to you. However, make sure the name and value are important for easy tracking.
*/
// Example:
logger.info({
    message:'Insert your error here',
    method: 'Insert',
    path: '/'
    })
```
## Development/Testing/Staging 
While during the development/testing/staging process, it is recommended to use ```debug``` or ```silly```:

### DEBUG 
This level is usually used to indicate which method is running, with what arguments, and what the result of the method is. At the debug level we don't need to do very detailed logging like at the trace level, in fact we just need to log these things just to show that the process is running. Regarding what information will be logged, this actually goes back to the team's agreement.
Usage:
```js
const logger = require('./logger.utils')
logger.debug('Insert your error here')
/* or if you want to add object you can write object to parameter. The object key name is up to you. However, make sure the name and value are important for easy tracking.
*/
// Example:
logger.debug({
    message:'Insert your error here',
    method: 'Insert',
    path: '/'
    })
```
### SILLY
this level is most informative (and usually even excessive). Trace messages report most application actions or events and are mostly used to follow application logic in full detail.
Usage:
```js
const logger = require('./logger.utils')
logger.silly('Insert your error here')
/* or if you want to add object you can write object to parameter. The object key name is up to you. However, make sure the name and value are important for easy tracking.
*/
// Example:
logger.silly({
    message:'Insert your error here',
    method: 'Insert',
    path: '/'
    })
```
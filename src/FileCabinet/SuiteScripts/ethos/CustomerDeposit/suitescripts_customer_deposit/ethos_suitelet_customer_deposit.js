/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/format', 'N/https', 'N/record', 'N/render', 'N/runtime'],
    /**
 * @param{file} file
 * @param{format} format
 * @param{https} https
 * @param{record} record
 * @param{render} render
 * @param{runtime} runtime
 */
    (file, format, https, record, render, runtime) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            let message = 'Suitelet';

            log.debug({title : 'onRequest', details : message});

            scriptContext.response.write(message);

        }

        return {onRequest}

    });

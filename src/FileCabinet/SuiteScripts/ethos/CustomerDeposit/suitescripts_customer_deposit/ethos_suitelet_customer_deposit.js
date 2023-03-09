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

            /* let message = 'Suitelet';
            log.debug({title : 'onRequest', details : message});
            scriptContext.response.write(message); */

            /* const customerDepositRequest = scriptContext.request;
            const customerDepositResponse = scriptContext.response;
            log.debug({title: 'Script Context Request', details: customerDepositRequest});
            log.debug({title: 'Script Context Response', details: customerDepositResponse}); */

            if (!scriptContext.request.method === https.Method.GET)
                return ;

            const depositData = getDepositInfo(scriptContext);

            // log.debug({title: 'Deposit Data', depositData});

        }

        const getDepositInfo = (scriptContext) => {

            // log.debug({ title : 'Testing get deposit info function', details : 'getDepositInfo()'});

           const params = scriptContext.request.parameters;
           const recId = params.transactionId;
           const rectType = params.recordType;

           const scriptContextAttr = {
               params,
               recId,
               rectType,
           };

           log.debug({ title : 'Script Context Attributes', details : scriptContextAttr});

        }


        return {onRequest}

    });

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/format', 'N/https', 'N/record', 'N/render', 'N/runtime'],

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

            return generateReport(scriptContext, depositData);

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

           if (!rectType || !recId)
               return ;

           if (!params.tpl)
               return ;

           const customerDeposit = record.load({id: recId, type: rectType, isDynamic: true});
           log.debug({title: 'Record', details: customerDeposit});

            // Getting Payment Events List Info from Netsuite //
            const paymentEventsListName = 'paymentevent';
            const lineCount = customerDeposit.getLineCount({sublistId: paymentEventsListName});
            // log.debug({title: 'Payment Events Line Count', details: lineCount});

            // Getting Customer Deposit Primary Info //
            let customer = customerDeposit.getValue({fieldId : 'entityname'});
            let salesOrder = customerDeposit.getValue({fieldId : 'salesorder'});
            let currency = customerDeposit.getValue({fieldId : 'currencyname'});
            let postingPeriod = customerDeposit.getValue({fieldId : 'postingperiod'});
            let account = customerDeposit.getValue({fieldId : 'account'});
            let deposit = customerDeposit.getValue({fieldId : 'tranid'});
            let paymentAmount = customerDeposit.getValue({fieldId : 'payment'});

            let depositData = {
                customer,
                salesOrder,
                currency,
                postingPeriod,
                account,
                deposit,
                paymentAmount,
                paymentEvents : [],
            };

            // Getting Payment Events Info //
            for (let i = 0; i < lineCount; i++)
            {
                let eventRecord =
                    {
                        transaction : customerDeposit.getSublistValue({
                            sublistId : paymentEventsListName,
                            fieldId : 'owningtransaction',
                            line : i}),
                        tranEvent : customerDeposit.getSublistValue({
                            sublistId : paymentEventsListName,
                            fieldId : 'type',
                            line : i}),
                        payment : customerDeposit.getSublistValue({
                            sublistId : paymentEventsListName,
                            fieldId : 'card',
                            line : i}),
                        result : customerDeposit.getSublistValue({
                            sublistId : paymentEventsListName,
                            fieldId : 'result',
                            line : i}),
                        amount : customerDeposit.getSublistValue({
                            sublistId : paymentEventsListName,
                            fieldId : 'amount',
                            line : i}),
                        date : customerDeposit.getSublistValue({
                            sublistId : paymentEventsListName,
                            fieldId : 'eventdate',
                            line : i}),
                    };

                depositData.paymentEvents.push(eventRecord);

                log.debug({ title : 'EVENT RECORD', details : eventRecord});
            }

            log.debug({ title : 'DEPOSIT DATA', details : depositData});

            return depositData;

        }

        const generateReport = (scriptContext, depositData) => {

            const reportPDFTemplate = '/SuiteScripts/ethos/CustomerDeposit/html_templates/customer_deposit_report.html';

            const renderer = render.create();

            const templateFile = file.load({id : reportPDFTemplate});

            renderer.addCustomDataSource({
                alias: 'record',
                format: render.DataSource.OBJECT,
                data: depositData,
            });

            renderer.templateContent = templateFile.getContents();
            log.debug({title : 'RENDERER TEMPLATE CONTENT', details: renderer.templateContent});

            const pdfFile = renderer.renderAsPdf();
            log.debug({title: 'PDF FILE', details: pdfFile});

            return scriptContext.response.writeFile(pdfFile, true);

        }


        return {onRequest}

    });

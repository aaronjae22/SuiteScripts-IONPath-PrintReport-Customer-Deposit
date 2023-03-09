/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/query', 'N/record', 'N/runtime', 'N/url'],

    (query, record, runtime, url) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

            const currentUser = runtime.getCurrentUser().email;
            const isEthos = runtime.getCurrentUser().email === 'harryeden21@gmail.com';

            log.debug({title: 'Current User', details: [currentUser, isEthos] });

            if (!isEthos)
                return ;

            const eventType = scriptContext.type;
            const isView = eventType === scriptContext.UserEventType.VIEW;

            if (!isView)
                return ;

            const thisRec = scriptContext.newRecord;
            const recordType = thisRec.type;
            const tranId = thisRec.id;

            const thisObj = {
                recordType: recordType,
                transactionId: tranId};

            const thisForm = scriptContext.form;

            const contextAttributes = {
                eventType,
                isView,
                // thisRec,
                recordType,
                tranId,
            }

            const contextObjects = {
                thisObj,
                thisForm,
            }

            log.debug({title: 'Context Attributes', details: contextAttributes});
            log.debug({title: 'Object and Form', details: contextObjects});

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });

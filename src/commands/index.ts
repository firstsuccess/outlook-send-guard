import { onMessageSend } from './handler';
// Associate immediately: classic Outlook does not run onReady for event handlers.
Office.actions.associate('onMessageSend', onMessageSend);

import { io } from "socket.io-client";
import API_URL, { IS_PRODUCTION } from './api/config';

export const socket = !IS_PRODUCTION ? io(API_URL) : null;
import './Toast.css';

import { createIcon } from '../icon';
import {
    DEFAULT_TOAST_DURATION_MS,
    DEFAULT_TOAST_VARIANT,
    TOAST_ARIA_LIVE_ATTRIBUTE,
    TOAST_ARIA_LIVE_POLITE,
    TOAST_BASE_CLASS,
    TOAST_CONTAINER_CLASS,
    TOAST_CONTAINER_ID,
    TOAST_EXIT_CLASS,
    TOAST_EXIT_DURATION_MS,
    TOAST_MESSAGE_CLASS,
    TOAST_MESSAGE_TAG,
    TOAST_MIN_DELAY_MS,
    TOAST_ROLE_ATTRIBUTE,
    TOAST_ROLE_STATUS,
    TOAST_ROOT_TAG,
    TOAST_STATUS_ICON_CLASS,
    TOAST_TYPEOF_NUMBER,
    TOAST_VARIANTS,
    TOAST_VARIANT_CLASS_PREFIX,
    TOAST_VARIANT_STATUS_ICON,
} from './Toast.constants';
import type { ToastProps, ToastVariant } from './Toast.type';

export type { ToastProps, ToastVariant } from './Toast.type';

let containerElement: HTMLDivElement | null = null;

function isToastVariant(value: unknown): value is ToastVariant {
    return TOAST_VARIANTS.includes(value as ToastVariant);
}

function resolveVariant(value: unknown): ToastVariant {
    return isToastVariant(value) ? value : DEFAULT_TOAST_VARIANT;
}

function getContainer(): HTMLDivElement {
    if (containerElement && document.body.contains(containerElement)) {
        return containerElement;
    }

    containerElement = document.createElement(TOAST_ROOT_TAG) as HTMLDivElement;
    containerElement.id = TOAST_CONTAINER_ID;
    containerElement.classList.add(TOAST_CONTAINER_CLASS);
    containerElement.setAttribute(TOAST_ROLE_ATTRIBUTE, TOAST_ROLE_STATUS);
    containerElement.setAttribute(TOAST_ARIA_LIVE_ATTRIBUTE, TOAST_ARIA_LIVE_POLITE);
    document.body.append(containerElement);

    return containerElement;
}

export function showToast(props: ToastProps): void {
    const { message, variant, durationMs, onDismiss } = props;

    const resolvedVariant = resolveVariant(variant);
    const resolvedDuration = typeof durationMs === TOAST_TYPEOF_NUMBER ? durationMs : DEFAULT_TOAST_DURATION_MS;

    const container = getContainer();

    const toastElement = document.createElement(TOAST_ROOT_TAG);
    toastElement.classList.add(TOAST_BASE_CLASS, TOAST_VARIANT_CLASS_PREFIX + resolvedVariant);

    const statusIconName = TOAST_VARIANT_STATUS_ICON[resolvedVariant];
    const statusIconElement = createIcon({ name: statusIconName, className: TOAST_STATUS_ICON_CLASS });
    toastElement.append(statusIconElement);

    const messageElement = document.createElement(TOAST_MESSAGE_TAG);
    messageElement.classList.add(TOAST_MESSAGE_CLASS);
    messageElement.textContent = message;
    toastElement.append(messageElement);

    container.append(toastElement);

    const exitDelay = Math.max(resolvedDuration - TOAST_EXIT_DURATION_MS, TOAST_MIN_DELAY_MS);

    setTimeout(() => {
        toastElement.classList.add(TOAST_EXIT_CLASS);
    }, exitDelay);

    setTimeout(() => {
        toastElement.remove();
        onDismiss?.();
    }, resolvedDuration);
}

import './Tooltip.css';

import { isInCatalog } from '../../shared/catalog-value';
import {
    DEFAULT_TOOLTIP_PLACEMENT,
    TOOLTIP_BASE_CLASS,
    TOOLTIP_COUNTER_INCREMENT,
    TOOLTIP_COUNTER_START,
    TOOLTIP_DESCRIBEDBY_ATTRIBUTE,
    TOOLTIP_EVENT_BLUR,
    TOOLTIP_EVENT_FOCUS,
    TOOLTIP_EVENT_KEYDOWN,
    TOOLTIP_EVENT_MOUSEENTER,
    TOOLTIP_EVENT_MOUSELEAVE,
    TOOLTIP_EVENT_TOUCHSTART,
    TOOLTIP_ESCAPE_KEY,
    TOOLTIP_GAP_PX,
    TOOLTIP_ID_PREFIX,
    TOOLTIP_PLACEMENTS,
    TOOLTIP_PLACEMENT_BOTTOM,
    TOOLTIP_PLACEMENT_CLASS_PREFIX,
    TOOLTIP_PLACEMENT_LEFT,
    TOOLTIP_PLACEMENT_RIGHT,
    TOOLTIP_PLACEMENT_TOP,
    TOOLTIP_POSITION_DIVISOR,
    TOOLTIP_POSITION_UNIT,
    TOOLTIP_REDUCED_MOTION_QUERY,
    TOOLTIP_REDUCED_MOTION_SHOW_DELAY_MS,
    TOOLTIP_ROLE_ATTRIBUTE,
    TOOLTIP_ROLE_VALUE,
    TOOLTIP_ROOT_TAG,
    TOOLTIP_SHOW_DELAY_MS,
    TOOLTIP_TYPEOF_FUNCTION,
} from './Tooltip.constants';
import type { TooltipPlacement, TooltipProps } from './Tooltip.type';

export type { TooltipPlacement, TooltipProps } from './Tooltip.type';

let tooltipCounter = TOOLTIP_COUNTER_START;

function isTooltipPlacement(value: unknown): value is TooltipPlacement {
    return isInCatalog(value, TOOLTIP_PLACEMENTS);
}

function resolvePlacement(value: unknown): TooltipPlacement {
    return isTooltipPlacement(value) ? value : DEFAULT_TOOLTIP_PLACEMENT;
}

function prefersReducedMotion(): boolean {
    return typeof window.matchMedia === TOOLTIP_TYPEOF_FUNCTION && window.matchMedia(TOOLTIP_REDUCED_MOTION_QUERY).matches;
}

export function attachTooltip(props: TooltipProps): void {
    const { target, content, placement } = props;
    const resolvedPlacement = resolvePlacement(placement);

    tooltipCounter += TOOLTIP_COUNTER_INCREMENT;
    const tooltipId = TOOLTIP_ID_PREFIX + tooltipCounter;

    const tooltipElement = document.createElement(TOOLTIP_ROOT_TAG);
    tooltipElement.id = tooltipId;
    tooltipElement.classList.add(TOOLTIP_BASE_CLASS, TOOLTIP_PLACEMENT_CLASS_PREFIX + resolvedPlacement);
    tooltipElement.setAttribute(TOOLTIP_ROLE_ATTRIBUTE, TOOLTIP_ROLE_VALUE);
    tooltipElement.textContent = content;
    tooltipElement.hidden = true;

    document.body.append(tooltipElement);
    target.setAttribute(TOOLTIP_DESCRIBEDBY_ATTRIBUTE, tooltipId);

    let showTimeoutId: ReturnType<typeof setTimeout> | undefined;

    function updatePosition(): void {
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltipElement.getBoundingClientRect();

        const verticalCenter = targetRect.top + (targetRect.height - tooltipRect.height) / TOOLTIP_POSITION_DIVISOR;
        const horizontalCenter = targetRect.left + (targetRect.width - tooltipRect.width) / TOOLTIP_POSITION_DIVISOR;

        const positionByPlacement: Record<TooltipPlacement, { top: number; left: number }> = {
            [TOOLTIP_PLACEMENT_TOP]: {
                top: targetRect.top - tooltipRect.height - TOOLTIP_GAP_PX,
                left: horizontalCenter,
            },
            [TOOLTIP_PLACEMENT_BOTTOM]: {
                top: targetRect.bottom + TOOLTIP_GAP_PX,
                left: horizontalCenter,
            },
            [TOOLTIP_PLACEMENT_LEFT]: {
                top: verticalCenter,
                left: targetRect.left - tooltipRect.width - TOOLTIP_GAP_PX,
            },
            [TOOLTIP_PLACEMENT_RIGHT]: {
                top: verticalCenter,
                left: targetRect.right + TOOLTIP_GAP_PX,
            },
        };

        const { top, left } = positionByPlacement[resolvedPlacement];
        tooltipElement.style.top = top + TOOLTIP_POSITION_UNIT;
        tooltipElement.style.left = left + TOOLTIP_POSITION_UNIT;
    }

    function show(): void {
        tooltipElement.hidden = false;
        updatePosition();
    }

    function hide(): void {
        tooltipElement.hidden = true;
    }

    function toggle(): void {
        if (tooltipElement.hidden) {
            show();
        } else {
            hide();
        }
    }

    function cancelScheduledShow(): void {
        if (showTimeoutId !== undefined) {
            clearTimeout(showTimeoutId);
            showTimeoutId = undefined;
        }
    }

    function scheduleShow(): void {
        cancelScheduledShow();
        const delay = prefersReducedMotion() ? TOOLTIP_REDUCED_MOTION_SHOW_DELAY_MS : TOOLTIP_SHOW_DELAY_MS;
        showTimeoutId = setTimeout(show, delay);
    }

    target.addEventListener(TOOLTIP_EVENT_MOUSEENTER, scheduleShow);
    target.addEventListener(TOOLTIP_EVENT_MOUSELEAVE, () => {
        cancelScheduledShow();
        hide();
    });
    target.addEventListener(TOOLTIP_EVENT_FOCUS, scheduleShow);
    target.addEventListener(TOOLTIP_EVENT_BLUR, () => {
        cancelScheduledShow();
        hide();
    });
    target.addEventListener(TOOLTIP_EVENT_TOUCHSTART, (event) => {
        event.preventDefault();
        cancelScheduledShow();
        toggle();
    });
    target.addEventListener(TOOLTIP_EVENT_KEYDOWN, (event) => {
        if ((event as KeyboardEvent).key === TOOLTIP_ESCAPE_KEY) {
            cancelScheduledShow();
            hide();
        }
    });
}

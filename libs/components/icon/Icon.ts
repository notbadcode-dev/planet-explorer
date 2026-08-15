import './Icon.css';

import {
    APP_ICON_SVGS,
    ICON_ARIA_HIDDEN_ATTRIBUTE,
    ICON_ARIA_LABEL_ATTRIBUTE,
    ICON_BASE_CLASS,
    ICON_CLASS_ATTRIBUTE,
    ICON_CLASS_SEPARATOR,
    ICON_DEFAULT_FILL,
    ICON_DEFAULT_SIZE,
    ICON_FALSE_ATTRIBUTE_VALUE,
    ICON_FILL_ATTRIBUTE,
    ICON_FOCUSABLE_ATTRIBUTE,
    ICON_HEIGHT_ATTRIBUTE,
    ICON_PARSE_ERROR,
    ICON_ROLE_ATTRIBUTE,
    ICON_ROLE_IMAGE_VALUE,
    ICON_SVG_SELECTOR,
    ICON_TEMPLATE_TAG,
    ICON_TRUE_ATTRIBUTE_VALUE,
    ICON_WIDTH_ATTRIBUTE,
} from './Icon.constants';
import type { IconProps } from './Icon.type';

export type { IconName, IconProps } from './Icon.type';

function parseIconSvg(svgSource: string): SVGElement {
    const template = document.createElement(ICON_TEMPLATE_TAG);
    template.innerHTML = svgSource.trim();

    const icon = template.content.querySelector(ICON_SVG_SELECTOR);

    if (!icon) {
        throw new Error(ICON_PARSE_ERROR);
    }

    return icon.cloneNode(true) as SVGElement;
}

function resolveClassName(className: string | undefined): string {
    return className
        ? `${ICON_BASE_CLASS}${ICON_CLASS_SEPARATOR}${className}`
        : ICON_BASE_CLASS;
}

function applyAccessibility(icon: SVGElement, ariaLabel: string | undefined): void {
    icon.setAttribute(ICON_FOCUSABLE_ATTRIBUTE, ICON_FALSE_ATTRIBUTE_VALUE);

    if (ariaLabel?.trim()) {
        icon.setAttribute(ICON_ROLE_ATTRIBUTE, ICON_ROLE_IMAGE_VALUE);
        icon.setAttribute(ICON_ARIA_LABEL_ATTRIBUTE, ariaLabel);
        icon.removeAttribute(ICON_ARIA_HIDDEN_ATTRIBUTE);
        return;
    }

    icon.setAttribute(ICON_ARIA_HIDDEN_ATTRIBUTE, ICON_TRUE_ATTRIBUTE_VALUE);
}

export function createIcon(props: IconProps): SVGElement {
    const {
        name,
        className,
        size = ICON_DEFAULT_SIZE,
        fill = ICON_DEFAULT_FILL,
        ariaLabel,
    } = props;

    const icon = parseIconSvg(APP_ICON_SVGS[name]);

    icon.setAttribute(ICON_CLASS_ATTRIBUTE, resolveClassName(className));
    icon.setAttribute(ICON_WIDTH_ATTRIBUTE, String(size));
    icon.setAttribute(ICON_HEIGHT_ATTRIBUTE, String(size));
    icon.setAttribute(ICON_FILL_ATTRIBUTE, fill);
    applyAccessibility(icon, ariaLabel);

    return icon;
}

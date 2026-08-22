import './Tabs.css';

import { createIcon } from '../icon';
import { attachTooltip } from '../tooltip';
import {
    TABS_ARIA_CONTROLS_ATTRIBUTE,
    TABS_ARIA_DISABLED_ATTRIBUTE,
    TABS_ARIA_LABELLEDBY_ATTRIBUTE,
    TABS_ARIA_SELECTED_ATTRIBUTE,
    TABS_ARROW_LEFT_KEY,
    TABS_ARROW_RIGHT_KEY,
    TABS_BASE_CLASS,
    TABS_BUTTON_TYPE_ATTRIBUTE_VALUE,
    TABS_CLICK_EVENT,
    TABS_DISABLED_TABINDEX,
    TABS_EMPTY_INDEX,
    TABS_ENABLED_TABINDEX,
    TABS_FALSE_VALUE,
    TABS_ICON_CLASS,
    TABS_ICON_NONE_COUNT,
    TABS_INDICATOR_CLASS,
    TABS_INDICATOR_INSTANT_CLASS,
    TABS_INDICATOR_TAG,
    TABS_INDICATOR_TRANSFORM_MIDDLE,
    TABS_INDICATOR_TRANSFORM_PREFIX,
    TABS_INDICATOR_TRANSFORM_SUFFIX,
    TABS_KEYDOWN_EVENT,
    TABS_LIST_CLASS,
    TABS_LIST_TAG,
    TABS_MIXED_ICON_ERROR,
    TABS_NEXT_DIRECTION,
    TABS_NOT_FOUND_INDEX,
    TABS_PANEL_CLASS,
    TABS_PANEL_ID_PREFIX,
    TABS_PANEL_TAG,
    TABS_PREVIOUS_DIRECTION,
    TABS_RESIZE_EVENT,
    TABS_ROLE_ATTRIBUTE,
    TABS_ROLE_TAB,
    TABS_ROLE_TABLIST,
    TABS_ROLE_TABPANEL,
    TABS_ROOT_TAG,
    TABS_STEP_INCREMENT,
    TABS_STEP_START,
    TABS_TAB_CLASS,
    TABS_TAB_ID_PREFIX,
    TABS_TAB_TAG,
    TABS_TRUE_VALUE,
    TABS_TYPEOF_FUNCTION,
} from './Tabs.constants';
import type { TabItem, TabsProps } from './Tabs.type';

export type { TabItem, TabsProps } from './Tabs.type';

function validateIconConsistency(tabs: TabItem[]): void {
    const withIconCount = tabs.filter((tab) => tab.icon).length;

    if (withIconCount > TABS_ICON_NONE_COUNT && withIconCount < tabs.length) {
        throw new Error(TABS_MIXED_ICON_ERROR);
    }
}

export function createTabs(props: TabsProps): HTMLDivElement {
    const { tabs, activeTabId, onChange } = props;

    validateIconConsistency(tabs);

    let currentActiveId = tabs.some((tab) => tab.id === activeTabId)
        ? activeTabId
        : tabs[TABS_NOT_FOUND_INDEX]?.id;

    const root = document.createElement(TABS_ROOT_TAG);
    root.classList.add(TABS_BASE_CLASS);

    const list = document.createElement(TABS_LIST_TAG);
    list.classList.add(TABS_LIST_CLASS);
    list.setAttribute(TABS_ROLE_ATTRIBUTE, TABS_ROLE_TABLIST);
    root.append(list);

    const indicator = document.createElement(TABS_INDICATOR_TAG);
    indicator.classList.add(TABS_INDICATOR_CLASS, TABS_INDICATOR_INSTANT_CLASS);
    list.append(indicator);

    const tabButtons: HTMLButtonElement[] = [];
    const panelElements: HTMLDivElement[] = [];

    for (const tab of tabs) {
        const tabId = TABS_TAB_ID_PREFIX + tab.id;
        const panelId = TABS_PANEL_ID_PREFIX + tab.id;
        const isActive = tab.id === currentActiveId;

        const tabButton = document.createElement(TABS_TAB_TAG) as HTMLButtonElement;
        tabButton.type = TABS_BUTTON_TYPE_ATTRIBUTE_VALUE;
        tabButton.classList.add(TABS_TAB_CLASS);
        tabButton.id = tabId;
        tabButton.setAttribute(TABS_ROLE_ATTRIBUTE, TABS_ROLE_TAB);
        tabButton.setAttribute(TABS_ARIA_CONTROLS_ATTRIBUTE, panelId);
        tabButton.setAttribute(TABS_ARIA_SELECTED_ATTRIBUTE, isActive ? TABS_TRUE_VALUE : TABS_FALSE_VALUE);
        tabButton.tabIndex = tab.disabled ? TABS_DISABLED_TABINDEX : TABS_ENABLED_TABINDEX;
        tabButton.setAttribute(TABS_ARIA_DISABLED_ATTRIBUTE, tab.disabled ? TABS_TRUE_VALUE : TABS_FALSE_VALUE);

        if (tab.icon) {
            tabButton.append(createIcon({ name: tab.icon, className: TABS_ICON_CLASS }));
        }
        tabButton.append(document.createTextNode(tab.label));
        list.append(tabButton);
        tabButtons.push(tabButton);

        if (tab.tooltip?.trim()) {
            attachTooltip({ target: tabButton, content: tab.tooltip });
        }

        const panelElement = document.createElement(TABS_PANEL_TAG) as HTMLDivElement;
        panelElement.classList.add(TABS_PANEL_CLASS);
        panelElement.id = panelId;
        panelElement.setAttribute(TABS_ROLE_ATTRIBUTE, TABS_ROLE_TABPANEL);
        panelElement.setAttribute(TABS_ARIA_LABELLEDBY_ATTRIBUTE, tabId);
        panelElement.hidden = !isActive;
        if (tab.panel) {
            panelElement.append(tab.panel);
        }
        root.append(panelElement);
        panelElements.push(panelElement);
    }

    function updateIndicator(): void {
        const activeButton = tabButtons.find((_, index) => tabs[index]?.id === currentActiveId);
        if (!activeButton) {
            return;
        }
        indicator.style.transform =
            TABS_INDICATOR_TRANSFORM_PREFIX +
            activeButton.offsetLeft +
            TABS_INDICATOR_TRANSFORM_MIDDLE +
            activeButton.offsetWidth +
            TABS_INDICATOR_TRANSFORM_SUFFIX;
    }

    function activateTab(id: string | undefined): void {
        currentActiveId = id;

        tabs.forEach((tab, index) => {
            const isActive = tab.id === id;
            const tabButton = tabButtons[index];
            const panelElement = panelElements[index];
            tabButton?.setAttribute(TABS_ARIA_SELECTED_ATTRIBUTE, isActive ? TABS_TRUE_VALUE : TABS_FALSE_VALUE);
            if (panelElement) {
                panelElement.hidden = !isActive;
            }
        });

        updateIndicator();
        onChange?.(id as string);
    }

    tabButtons.forEach((tabButton, index) => {
        tabButton.addEventListener(TABS_CLICK_EVENT, () => {
            const tab = tabs[index];
            if (!tab || tab.disabled) {
                return;
            }
            activateTab(tab.id);
        });
    });

    function findNextEnabledIndex(startIndex: number, direction: number): number {
        for (let step = TABS_STEP_START; step <= tabs.length; step += TABS_STEP_INCREMENT) {
            const candidateIndex = (startIndex + direction * step + tabs.length) % tabs.length;
            const candidate = tabs[candidateIndex];
            if (candidate && !candidate.disabled) {
                return candidateIndex;
            }
        }
        return startIndex;
    }

    list.addEventListener(TABS_KEYDOWN_EVENT, (event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key !== TABS_ARROW_LEFT_KEY && keyboardEvent.key !== TABS_ARROW_RIGHT_KEY) {
            return;
        }
        keyboardEvent.preventDefault();

        const currentIndex = tabs.findIndex((tab) => tab.id === currentActiveId);
        const baseIndex = currentIndex === TABS_EMPTY_INDEX ? TABS_NOT_FOUND_INDEX : currentIndex;
        const direction = keyboardEvent.key === TABS_ARROW_RIGHT_KEY ? TABS_NEXT_DIRECTION : TABS_PREVIOUS_DIRECTION;
        const nextIndex = findNextEnabledIndex(baseIndex, direction);
        const nextTab = tabs[nextIndex];
        if (!nextTab) {
            return;
        }

        activateTab(nextTab.id);
        tabButtons[nextIndex]?.focus();
    });

    if (typeof window.requestAnimationFrame === TABS_TYPEOF_FUNCTION) {
        window.requestAnimationFrame(() => {
            updateIndicator();
            indicator.classList.remove(TABS_INDICATOR_INSTANT_CLASS);
        });
    } else {
        updateIndicator();
    }

    window.addEventListener(TABS_RESIZE_EVENT, updateIndicator);

    return root;
}

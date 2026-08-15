export interface DialogProps {
    title: string;
    description?: string;
    content?: HTMLElement | HTMLElement[];
    actions?: HTMLElement | HTMLElement[];
    onClose: () => void;
    closeLabel?: string;
}

export interface InputProps {
    value?: string;
    placeholder?: string;
    label?: string;
    ariaLabel?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    onInput: (value: string) => void;
}

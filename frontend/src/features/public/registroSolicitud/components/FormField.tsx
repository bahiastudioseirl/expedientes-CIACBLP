interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'email' | 'tel' | 'number' | 'url';
    isTextarea?: boolean;
    maxLength?: number;
    showCounter?: boolean;
    className?: string;
}

export const FormField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder = '', 
    required = false, 
    type = 'text', 
    isTextarea = false,
    maxLength,
    showCounter = false,
    className = ''
}: FormFieldProps) => {
    const inputClasses = `w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white border-2 border-gray-200 rounded-md sm:rounded-lg focus:border-[#733AEA] focus:ring-2 focus:ring-purple-100 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium hover:border-gray-300 text-xs sm:text-sm ${className}`;

    const labelString = typeof label === 'string' ? label : '';
    const hasAsterisk = labelString.includes('*');

    return (
        <div className="space-y-1 sm:space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
                {label}
                {!hasAsterisk && required && <span className="text-red-500"> *</span>}
            </label>
            {isTextarea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
                    className={`${inputClasses} min-h-[60px] sm:min-h-[80px] resize-vertical`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    maxLength={maxLength}
                    className={inputClasses}
                />
            )}
            {showCounter && maxLength && (
                <div className="text-right">
                    <span className={`text-xs ${value.length >= maxLength ? 'text-red-500' : 'text-gray-500'}`}>
                        {value.length} / {maxLength}
                    </span>
                </div>
            )}
        </div>
    );
};
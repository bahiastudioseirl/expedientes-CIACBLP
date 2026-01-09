interface FormSectionProps {
    number: number;
    title: string;
    children: React.ReactNode;
}

export const FormSection = ({ number, title, children }: FormSectionProps) => {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <span className="bg-gradient-to-br from-[#733AEA] to-purple-700 text-white rounded-lg sm:rounded-xl w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 shadow-md">
                    {number}
                </span>
                <span className="text-sm sm:text-base">{title}</span>
            </h3>
            {children}
        </div>
    );
};
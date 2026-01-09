interface FormSectionProps {
    number: number;
    title: string;
    children: React.ReactNode;
}

export const FormSection = ({ number, title, children }: FormSectionProps) => {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-gradient-to-br from-[#733AEA] to-purple-700 text-white rounded-xl w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 shadow-md">
                    {number}
                </span>
                {title}
            </h3>
            {children}
        </div>
    );
};
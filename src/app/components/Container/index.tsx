interface ContainerProps {
    children: any;
    className?: string;
}

export default function Container({ children, className }: ContainerProps) {
    return (
        <div className={`container mx-auto px-6 py-10 lg:py-16 lg:px-0 xl:py-20 ${className ? className : ''}`}>
            {children}
        </div>
    )
}
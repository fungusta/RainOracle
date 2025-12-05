interface RainProps {
    intensity: number;
    className?: string;
}

export default function Rain({ intensity = 0.5, className }: RainProps) {
    const drops = Array.from({ length: intensity * 100 });

    return (
        <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
            {drops.map((_, i) => (
                <div
                    key={i}
                    className="drop"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random()}s`,
                        animationDuration: `${0.4 + Math.random() * 0.5}s`,
                    }}
                />
            ))}
        </div>
    );
}

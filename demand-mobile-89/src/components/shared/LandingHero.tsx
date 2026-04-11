import { Button } from "@/components/ui/button";

interface LandingHeroProps {
    topic?: string;
    title: string;
    description: string;
    buttonText?: string;
    onButtonClick?: () => void;
    backgroundImageUrl: string;
}

export const LandingHero = ({
    topic,
    title,
    description,
    buttonText,
    onButtonClick,
    backgroundImageUrl,
}: LandingHeroProps) => {
    return (
        <section className="px-4 py-4 md:px-10 md:py-10 lg:px-16 lg:py-16 pt-[120px] md:pt-[140px] lg:pt-[160px]">
            <div className="relative min-h-[70vh] md:min-h-[80vh] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] flex items-center">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                />

                {/* Forest Green Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-green-950/90 via-green-900/80 to-emerald-900/60 mix-blend-multiply" />
                <div className="absolute inset-0 z-0 bg-black/30" />

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-24 flex flex-col items-start justify-center">
                    <div className="max-w-2xl text-left">
                        {topic && (
                            <span className="inline-block text-emerald-400 font-semibold tracking-wide text-sm md:text-base mb-4 md:mb-6 uppercase">
                                {topic}
                            </span>
                        )}

                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
                            {title}
                        </h1>

                        <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 md:mb-12 max-w-xl font-medium">
                            {description}
                        </p>

                        {buttonText && onButtonClick && (
                            <Button
                                onClick={onButtonClick}
                                className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-8 py-6 h-auto text-lg font-bold transition-all"
                            >
                                {buttonText}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

import { SplashCursor } from "@/components/ui/splash-cursor";

export function SplashCursorDemo() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SplashCursor />
      <div className="relative z-10 flex h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-4xl font-bold text-white">Splash Cursor Effect</h1>
        <p className="mb-8 text-lg text-white/80 max-w-md text-center">
          Move your cursor around to see the fluid simulation effect. Click to create splashes.
        </p>
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 max-w-md">
          <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
          <ul className="text-white/90 list-disc pl-5 space-y-1">
            <li>Real-time WebGL fluid simulation</li>
            <li>Interactive with mouse movement</li>
            <li>Colorful particle effects</li>
            <li>Customizable parameters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
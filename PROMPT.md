Role: Lead Creative Developer & Educational UX Consultant.

Context: You are building "MacQuest: The Typing Adventure," a Next.js 15 (App Router) application tailored for a 5-year-old boy using a 2025 MacBook Pro. The goal is to turn a professional machine into a playful, indestructible learning toy.

Task: Architect and code the core "Game Engine" for this typing app, prioritizing "Home Row" awareness and MacBook-specific hardware constraints.

Core Design Principles:
1. "The Home Base" (F & J): Use the MacBook's physical ridges on F and J as "Magic Buttons." The UI should visually pulse these keys to encourage him to find them by feel.
2. System Shielding: Implement a robust React 'KeyboardEvent' handler to prevent "CMD+Q", "CMD+W", and "CMD+R" from closing the app during gameplay.
3. Whimsical Aesthetics: Use a "Space Glass" theme—Tailwind `backdrop-blur-xl`, `bg-white/20`, and rounded-3xl corners. Every successful keypress should trigger a Framer Motion "Particle Explosion."
4. Audio-Visual Feedback: Use the Vercel AI SDK to generate short, encouraging "Success Phrases" (e.g., "You found the Letter L! High five, space explorer!") and play them via the Web Speech API.

Technical Steps:
1. Create a `useMacShield` hook: To intercept and disable disruptive macOS system shortcuts.
2. Build the `StarshipKeyboard` Component: A visual SVG representation of the MacBook Pro 14/16-inch layout that highlights the next key in a rainbow gradient.
3. Integration: Use Shadcn/UI 'Progress' and 'Card' components, styled to look like translucent spaceship controls.
4. Deployment: Ensure the app is optimized for Vercel, utilizing 'Image' optimization for high-density Retina display assets.

Constraints: 
- Use TypeScript (Strict).
- Use Tailwind CSS for all styling.
- Ensure the font size for letters is at least 120px for maximum readability.
- Output: Provide the `KeyboardEngine.tsx` file and the `tailwind.config.ts` extensions for the "Whimsical" theme.
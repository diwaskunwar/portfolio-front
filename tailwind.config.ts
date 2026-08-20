import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			/* Two additions at the ends of the default scale, because the
			   defaults leave both extremes unaddressed.

			   `xs` covers the 320-390px phones (SE, mini, older Androids),
			   which otherwise sit on the unprefixed base styles alongside a
			   430px Pro Max and get the same padding and type as a device a
			   third wider. `3xl` is the point past which a 1536px shell on a
			   27-inch display reads as a narrow column floating in grey. */
			screens: {
				xs: '400px',
				'3xl': '1800px',
			},
			transitionTimingFunction: {
				// Site-wide easing. Named so it is not written as an ambiguous
				// arbitrary value at every call site.
				swift: 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
			fontFamily: {
				sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			colors: {
				surface: 'hsl(var(--surface))',
				'surface-raised': 'hsl(var(--surface-raised))',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				faint: 'hsl(var(--faint))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 4px)',
				sm: 'calc(var(--radius) - 8px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-right': {
					from: { opacity: '0', transform: 'translateX(20px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-left': {
					from: { opacity: '0', transform: 'translateX(-20px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'heartbeat': {
					'0%': { transform: 'scale(1)' },
					'14%': { transform: 'scale(1.3)' },
					'28%': { transform: 'scale(1)' },
					'42%': { transform: 'scale(1.3)' },
					'70%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1)' }
				},
				'slow-pulse': {
					'0%, 100%': { transform: 'scale(1)', opacity: '1' },
					'20%': { transform: 'scale(1.15)', opacity: '1' },
					'40%': { transform: 'scale(1)', opacity: '1' },
					'60%': { transform: 'scale(1)', opacity: '0.8' },
					'80%': { transform: 'scale(1)', opacity: '0.8' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-in-right': 'fade-in-right 0.5s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.5s ease-out forwards',
				'heartbeat': 'heartbeat 1s ease-in-out infinite',
				'slow-pulse': 'slow-pulse 4s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			}
		}
	},
	future: {
		/* Compiles every `hover:` utility inside `@media (hover: hover)`.
		   Without it a tap on a touch screen leaves the element stuck in its
		   hover state until you tap elsewhere, which on this page means cards
		   and nav items staying lit after a finger has moved on. */
		hoverOnlyWhenSupported: true,
	},
	plugins: [
		require("tailwindcss-animate"),
		/* A tablet is wider than the `md` breakpoint but has no pointer that
		   can hover. Width alone therefore cannot decide whether a hover-only
		   control is safe to show, and the nav rail was unreachable on an
		   iPad because of exactly that. */
		plugin(({ addVariant }) => {
			addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
			addVariant('no-hover', '@media not all and (hover: hover) and (pointer: fine)');
		}),
	],
} satisfies Config;

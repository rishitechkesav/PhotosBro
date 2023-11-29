<script lang="ts">
	import TextGradient from './TextGradient.svelte';

	import Button from '$lib/components/Button.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { showInfo } from '$lib/utilities';
	import Icon from '$lib/components/Icon.svelte';

	const manAvatars = Array.from({ length: 10 }, (_, index) => `avatars/man (${index + 1}).png`);
	const womanAvatars = Array.from(
		{ length: 12 },
		(_, index) => `avatars/woman (${index + 1}).png`
	);
	 let darkMode = false; // Variable to control dark mode state

  // Function to toggle dark mode
  function toggleDarkMode() {
    darkMode = !darkMode;
  }
</script>

<div class="prose px-2 lg:prose-xl text-center py-16 min-w-full">

	<h2> </h2>
<h2>
  Create
  <span class="magic">
    <span class="magic-text">stunning photos</span>
  </span>
with AI-based generation
</h2>
	<p class="max-w-2xl mx-auto">
		Generate unique, professional-looking images tailored to your taste with our AI-based service.
		Try it now and see the possibilities.
	</p>
	<Button type="button" link="/app" animated endIcon="arrow_forward" class="text-white">START GENERATING IMAGES</Button>
</div>
<div class="relative pb-28">
	<div class="absolute bottom-0 left-[20%] -ml-12 overflow-visible w-40 aspect-square">
		<img
			src="avatars/man_from.jpeg"
			loading="lazy"
			alt="Demo source"
			class="absolute z-10 w-40 aspect-square rotate-12 shadow-md rounded-md"
		/>
		<img
			src="arrow.png"
			alt="Arrow"
			class="absolute text-black left-40 -bottom-4 z-20 rotate-[50deg]"
		/>
	</div>
</div>
<div class="marquee w-full">
	<div class="carousel carousel-center p-4 space-x-4 bg-neutral marquee__group">
		{#each manAvatars as image}
			<div class="carousel-item">
				<img
					src={image}
					loading="eager"
					alt="Demo avatar"
					class="rounded-box aspect-square h-[30vh]"
				/>
			</div>
		{/each}
	</div>
</div>
<div class="marquee marquee--reverse w-full -mt-4">
	<div class="carousel carousel-center p-4 space-x-4 bg-neutral marquee__group">
		{#each womanAvatars as image}
			<div class="carousel-item">
				<img
					src={image}
					loading="eager"
					alt="Demo avatar"
					class="rounded-box aspect-square h-[30vh]"
				/>
			</div>
		{/each}
	</div>
</div>
<div class="relative pb-28">
	<div class="absolute top-0 right-[20%] -ml-12 overflow-visible w-40 aspect-square">
		<img
			src="avatars/woman_from.jpeg"
			loading="lazy"
			alt="Demo source"
			class="absolute z-10 w-40 aspect-square rotate-12 shadow-md rounded-md"
		/>
		<img
			src="arrow.png"
			alt="Arrow"
			class="absolute text-white right-44 rotate-[230deg]"
		/>
	</div>
</div>

<div class="prose px-2 lg:prose-xl text-center pt-16 min-w-full">
	<h2>What Does It Cost?</h2>
</div>

<div
	class="mt-12 m-auto -space-y-4 items-center justify-center md:flex md:space-y-0 md:-space-x-4 xl:w-10/12 px-8"
>
	<div class="card relative z-10 -mx-4 group md:w-6/12 md:mx-0 lg:w-5/12">
		<div aria-hidden="true" class="absolute top-0 w-full h-full rounded-2xl bg-black shadow-xl" style="background-color: #191b1c;" />
		<div class="relative p-6 space-y-6 lg:p-8">
			<h3 class="text-3xl font-semibold text-center text-white">50 Ai Avatars</h3>
			<div>
				<div class="relative flex justify-around items-center">
					<span class="block text-3xl text-gray-400 font-bold line-through">500 INR</span>
					<div class="relative flex justify-around mb-2">
						<div class="relative flex flex-row items-end gap-1">
							<span class="text-7xl text-gray-100 font-bold leading-0">299</span>
							<span class="block text-sm text-blue-500 font-bold">INR</span>
						</div>
					</div>
					
				</div>
			</div>

			<div>
				<Button type="button" link="/checkout" block animated>Buy now</Button>
				<div class="flex flex-row gap-1 h-5 mt-3 mx-auto">
					<img src="mastercard-alt.svg" alt="Mastercard" />
					<img src="visa.svg" alt="Visa" />
					<img src="american-express.svg" alt="American Express" />
					<img src="apple-pay.svg" alt="Apple Pay" />
					<img src="google-pay.svg" alt="Google Pay" />
				</div>
			</div>
		</div>
	</div>

	<div class="relative group md:w-6/12 lg:w-7/12" style="background-color: #191b1c;">
		<div aria-hidden="true" class="absolute top-0 w-full h-full rounded-2xl bg-black shadow-lg" style="background-color: #191b1c;" />
		<div
			class="relative p-6 pt-10 md:p-8 md:pl-12 md:rounded-r-2xl lg:pl-20 lg:p-16 prose lg:prose-xl text-center"
		>
			<p class="max-w-2xl mx-auto">
				Training an AI model to understand the physiognomy of a specific subject requires a lot of
				computational power, so it is quite costly to create a model that can accurately reproduce
				the specified subject.
			</p>
		</div>
	</div>
</div>

<div class="prose px-2 lg:prose-xl text-center pt-16 min-w-full">
	<h2>How it works</h2>
</div>
<ul class="steps steps-vertical mx-auto mt-8 pl-0 md:pl-48">
	<li class="step">
		<span class="flex flex-row items-center gap-2"><Icon name="how_to_reg" />Sign up</span>
	</li>
	<li class="step">
		<span class="flex flex-row items-center gap-2"
			><Icon name="cloud_upload" />Upload your photos</span
		>
	</li>
	<li class="step">
		<span class="flex flex-row items-center gap-2"
			><Icon name="add_shopping_cart" />Complete payment</span
		>
	</li>
	<li class="step">
		<span class="flex flex-row items-center gap-2"
			><Icon name="neurology" />Get 50 AI Avatars</span
		>
	</li>

</ul>

<div class="prose px-2 lg:prose-xl text-center pt-16 min-w-full">
	<h2>More popular than <TextGradient>ever</TextGradient></h2>
<div class="stats stats-vertical lg:stats-horizontal shadow" style="background-color: #191b1c;">
		<div class="stat">
			<div class="stat-title">Avatars generated</div>
			<div class="stat-value">2K</div>
			<div class="stat-desc">August 1st - August 10th</div>
		</div>

		<div class="stat">
			<div class="stat-title">New Users</div>
			<div class="stat-value">200</div>
			<div class="stat-desc">↗️ 22%</div>
		</div>

		<div class="stat">
			<div class="stat-title">Average training time</div>
			<div class="stat-value">30min</div>
			<div class="stat-desc">↘️ 60min (50%)</div>
		</div>
	</div>
</div>

<div class="prose px-2 lg:prose-xl text-center py-16 min-w-full">
	<h2 class="max-w-2xl mx-auto">
		Create unique and personalized <TextGradient>Avatars</TextGradient> with AI assistance
	</h2>
	<div class="gap-4">
		<Button type="button" link="/app" animated endIcon="arrow_forward" class="text-white">Start now</Button>

	</div>
</div>
<div class="fixed bottom-4 right-4">

</div>


<style>
	:root {
		--color-text: navy;
		--color-bg: black;
		--color-bg-accent: #ecdcc0;
		--duration: 60s;
		--scroll-start: 0;
		--scroll-end: calc(-100% + 100vw);
	}
	.marquee {
		display: flex;
		overflow: hidden;
		user-select: none;
	}

	.marquee__group {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		min-width: 100%;
		animation: scroll-x var(--duration) linear infinite;
	}
	.marquee--reverse .marquee__group {
		animation-direction: reverse;
		animation-delay: -3s;
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee__group {
			animation-play-state: paused;
		}
	}
	  :root {
    --color-text: navy;
    --color-bg: papayawhip;
    --color-bg-accent: #ecdcc0;
    --duration: 60s;
    --scroll-start: 0;
    --scroll-end: calc(-100% + 100vw);
  }

  .dark {
    --color-text: #f8f8f8;
    --color-bg: #333;
    --color-bg-accent: #444;
  }

  /* Add styles for dark mode specific elements */
  .dark .carousel-item img {
    filter: grayscale(100%) brightness(0.7);
  }
	@keyframes scroll-x {
		from {
			transform: translateX(var(--scroll-start));
		}
		to {
			transform: translateX(var(--scroll-end));
		}
	}

:root {  
  --purple: rgb(123, 31, 162);
  --violet: rgb(103, 58, 183);
  --pink: rgb(244, 143, 177);
}

@keyframes background-pan {
  from {
    background-position: 0% center;
  }
  
  to {
    background-position: -200% center;
  }
}

@keyframes scale {
  from, to {
    transform: scale(0);
  }
  
  50% {
    transform: scale(1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  
  to {
    transform: rotate(180deg);
  }
}

body {
  background-color: rgb(10, 10, 10);
  display: grid;
  height: 100vh;
  margin: 0px;
  overflow: hidden;
  place-items: center;
}

h1 {
  color: white;
  font-family: "Rubik", sans-serif;
  font-size: clamp(2em, 2vw, 4em);
  font-weight: 400;
  margin: 0px;
  padding: 20px;
  text-align: center;
}

h2 > .magic {
  display: inline-block;
  position: relative;
}

h2 > .magic > .magic-star {
  --size: clamp(20px, 1.5vw, 30px);
  
  animation: scale 700ms ease forwards;
  display: block;
  height: var(--size);
  left: var(--star-left);
  position: absolute;
  top: var(--star-top);
  width: var(--size);
}

h2 > .magic > .magic-star > svg {
  animation: rotate 1000ms linear infinite;
  display: block;
  opacity: 0.7;
}

h2 > .magic > .magic-star > svg > path {
  fill: var(--violet);
}

h2 > .magic > .magic-text {
  animation: background-pan 3s linear infinite;
  background: linear-gradient(
    to right,
    var(--purple),
    var(--violet),
    var(--pink),
    var(--purple)
  );
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

/* -- YouTube Link Styles -- */

#source-link {
  top: 60px;
}

#source-link > i {
  color: rgb(94, 106, 210);
}

#yt-link {  
  top: 10px;
}

#yt-link > i {
  color: rgb(239, 83, 80);
}

.meta-link {
  align-items: center;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;  
  display: inline-flex;
  gap: 5px;
  left: 10px;
  padding: 10px 20px;
  position: fixed;
  text-decoration: none;
  transition: background-color 600ms, border-color 600ms;
  z-index: 10000;
}

.meta-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.meta-link > i, .meta-link > span {
  height: 20px;
  line-height: 20px;
}

.meta-link > span {
  color: white;
  font-family: "Rubik", sans-serif;
  transition: color 600ms;
}
:root {
  --border: rgb(3, 169, 244);
  
  --g1: rgb(98, 0, 234);
  --g2: rgb(236, 64, 122);
  --g3: rgb(253, 216, 53);
}

body {
  background-color: rgb(10, 10, 10);
  display: grid;
  height: 100vh;
  margin: 0px;
  padding: 0px;
  place-items: center;
}


</style>

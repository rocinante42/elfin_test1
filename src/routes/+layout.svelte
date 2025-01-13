<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
                gcTime: 1000 * 60 * 60 * 1, // 1 hour
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>

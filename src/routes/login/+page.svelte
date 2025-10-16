<script lang="ts">
	import LoginForm from "$lib/components/LoginForm.svelte";
</script>

<svelte:head>
	<title>Login - Smart City</title>
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
	<div class="w-full max-w-md">
		<LoginForm />
	</div>
</div>

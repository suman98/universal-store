import { Toaster } from 'sonner';

export function Toast() {
	return (
		<Toaster
			position="top-right"
			richColors
			closeButton
			theme="light"
			duration={4000}
		/>
	);
}

export { toast } from 'sonner';
